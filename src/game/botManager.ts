import { type Board } from "../util/world/board";
import type { GameMessage, InitialBotData, WorkerMessage } from "../util/messages";
import type { BotRequest } from "../bot/sdk/requests";
import { editorHandler } from "./events/editorHandler.ts";
import WorkerErrorEvent from "./events/workerErrorEvent.ts";
import { validateMove } from "../util/movement";
import TileUpdatedEvent from "../util/world/events/tileUpdated";
import { cloneData, cloneEntity } from "./cloneData.ts";
import { reactive } from "vue";
import AddGizmosEvent from "./events/addGizmosEvent.ts";
import { type BotInstance } from "./botInstance.ts";
import ManagedBoard from "./managedBoard.ts";
import EntityAddedEvent from "../util/world/events/entityAdded";
import EntityPositionUpdatedEvent from "../util/world/events/entityPosition";
import EntityRemovedEvent from "../util/world/events/entityRemoved";
import { botRadius } from "../bot/sdk/bot.js";
import { plant, plantableToPlantType } from "./plants/create.ts";
import { tileSize, worldToTile } from "../util/tileConstants";
import { modifyInventory } from "../util/inventoryHelper";
import type { Updatable } from "../bot/sdk/entities";
import type RenderEvent from "../util/world/events/render";
import type EntityEnergyUpdatedEvent from "../util/world/events/energyUpdated";
import WorkerLogEvent from "./events/workerLogEvent.ts";
import { getDrops, isPlant } from "./plants/harvesting.ts";
import type { ItemType } from "../bot/sdk/items";
import type ItemUpdatedEvent from "../util/world/events/itemUpdated";
import { isInRange } from "../util/distance";
import { createEntity } from "./entities/create.ts";
import MovableEntity from "./entities/movableEntity.ts";

type EventHandler<T> = (event: T) => void;

interface EventHandlers {
    render: EventHandler<RenderEvent>;
    entityAdded: EventHandler<EntityAddedEvent>;
    entityPositionUpdated: EventHandler<EntityPositionUpdatedEvent>;
    entityEnergyUpdated: EventHandler<EntityEnergyUpdatedEvent>;
    entityRemoved: EventHandler<EntityRemovedEvent>;
    itemUpdated: EventHandler<ItemUpdatedEvent>;
}

export default class BotManager implements Updatable {
    private readonly board: ManagedBoard;
    private readonly worker?: Worker;
    private readonly handlers?: EventHandlers;
    readonly bots: Map<string, BotInstance>;

    constructor(board: ManagedBoard, entryPoint?: string, previous?: BotManager) {
        editorHandler.dispatchEvent(new Event("workerinit"));
        this.board = board;
        this.bots = previous?.bots ?? new Map<string, BotInstance>();
        if (!entryPoint)
            return;
        this.worker = new Worker(`${import.meta.env.BASE_URL}bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint)}`, { type: "module" });
        // noinspection JSUnusedGlobalSymbols
        const callbacks: EventHandlers = {
            render: ev => this.send({ type: "render", delta: ev.deltaTime }),
            entityAdded: ev => this.sendAdd(ev),
            entityPositionUpdated: ev => this.sendMove(ev),
            entityEnergyUpdated: ev => this.sendEnergy(ev),
            entityRemoved: ev => this.sendRemove(ev),
            itemUpdated: ev => this.sendItemUpdate(ev)
        };
        this.handlers = callbacks;
        this.worker.addEventListener("message", event => this.handleMessage(event));
        editorHandler.addEventListener("render", callbacks.render);
        board.addEventListener("entityadded", callbacks.entityAdded);
        board.addEventListener("entitypositionupdated", callbacks.entityPositionUpdated);
        board.addEventListener("entityenergyupdated", callbacks.entityEnergyUpdated);
        board.addEventListener("entityremoved", callbacks.entityRemoved);
        board.addEventListener("itemupdated", callbacks.itemUpdated);
    }

    private handleMessage(event: MessageEvent<WorkerMessage>) {
        if (!event.data)
            return;
        switch (event.data.type) {
            case "log":
                if (event.data.logType === "error" || event.data.logType === "fatal")
                    editorHandler.dispatchEvent(new WorkerErrorEvent(event.data.content, event.data.logType === "fatal"));
                editorHandler.dispatchEvent(new WorkerLogEvent(event.data.content, event.data.logType));
                break;
            case "ready":
                editorHandler.dispatchEvent(new Event("workerready"));
                break;
            case "bot":
                this.handleRequest(event.data.request, event.data.name);
                break;
            case "drawGizmos":
                editorHandler.dispatchEvent(new AddGizmosEvent(event.data.gizmos));
                break;
            case "clearGizmos":
                editorHandler.dispatchEvent(new Event("cleargizmos"));
                break;
        }
    }

    private handleRequest(request: BotRequest, name: string) {
        if (request.type === "create") {
            this.bots.set(name, {
                name,
                position: reactive({ x: 0, y: 0 }),
                inventory: new Map(),
                chunkSeconds: new Map(),
                energy: 1,
                magicCooldown: 60
            });
            return;
        }
        if (request.type === "terminate") {
            this.bots.delete(name);
            return;
        }
        const bot = this.bots.get(name);
        if (!bot)
            return;
        const position = bot.position;
        switch (request.type) {
            case "move":
                const { x, y, valid } = validateMove(this.board, position, request.deltaX, request.deltaY, botRadius);
                position.x = x;
                position.y = y;
                if (!valid)
                    this.send({ type: "bot", name, response: { type: "position", x, y } });
                break;
            case "harvest": {
                const tile = this.board.getTileAt(position.x, position.y);
                const drops = getDrops(tile);
                if (!drops || !this.depleteEnergy(bot, 0.01))
                    break;
                tile.data = undefined;
                editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
                for (const item of Object.keys(drops)) {
                    const count = drops[item];
                    modifyInventory(bot.inventory, item, count);
                    this.send({ type: "bot", name, response: { type: "pickUp", item, count } });
                }
                break;
            }
            case "plant": {
                const amount = bot.inventory.get(request.kind) ?? 0;
                const type = plantableToPlantType(request.kind);
                if (type && amount > 0
                    && this.depleteEnergy(bot, 0.005)
                    && plant(this.board, Math.floor(worldToTile(position.x)), Math.floor(worldToTile(position.y)), type))
                    this.modifyInventory(bot, request.kind, -1);
                break;
            }
            case "drop":
                const amount = Math.min(Math.max(0, request.amount), bot.inventory.get(request.item) ?? 0);
                if (!amount)
                    break;
                this.board.handleItemUpdate({
                    id: crypto.randomUUID(),
                    type: request.item,
                    amount,
                    position: { ...bot.position }
                });
                this.modifyInventory(bot, request.item, -amount);
                break;
            case "magic":
                if (bot.magicCooldown > 0)
                    break;
                console.log(request.target)
                if ("id" in request.target) {
                    for (const entity of this.board.entities.values()) {
                        if (entity.id !== request.target.id || !(entity instanceof MovableEntity))
                            continue;
                        if (!isInRange(entity.position.x, entity.position.y, bot.position.x, bot.position.y, tileSize))
                            break;
                        entity.depleteEnergy(-1);
                        const clone = createEntity(this.board, { ...bot.position }, entity.type);
                        if (clone instanceof MovableEntity)
                            clone.depleteEnergy(Math.random() * 0.2 + 0.6);
                        bot.magicCooldown = 60;
                        return;
                    }
                    this.sendMagicReady(bot);
                    break;
                }
                const tile = this.board.getTile(request.target.x, request.target.y);
                if (!tile.data || !isPlant(tile.data)) {
                    this.sendMagicReady(bot);
                    break;
                }
                tile.data.ageSeconds = 1000;
                editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
                bot.magicCooldown = 60;
                break;
        }
    }

    modifyInventory(bot: BotInstance, item: ItemType, delta: number) {
        modifyInventory(bot.inventory, item, delta);
        this.send({ type: "bot", name: bot.name, response: { type: "pickUp", item, count: delta } });
    }

    deleteBot(name: string) {
        this.send({ type: "bot", name, response: { type: "terminate" } });
    }

    terminate() {
        if (this.handlers) {
            editorHandler.removeEventListener("render", this.handlers.render);
            this.board.removeEventListener("entityadded", this.handlers.entityAdded);
            this.board.removeEventListener("entitypositionupdated", this.handlers.entityPositionUpdated);
            this.board.removeEventListener("entityremoved", this.handlers.entityRemoved);
            this.board.removeEventListener("entityenergyupdated", this.handlers.entityEnergyUpdated);
            this.board.removeEventListener("itemupdated", this.handlers.itemUpdated);
        }
        this.worker?.terminate();
    }

    sendBoard(board: Board) {
        this.send({
            type: "world",
            board: JSON.stringify(board.chunkStore),
            bots: Array.from(this.bots.values()).map(toInitialData),
            entities: Array.from(this.board.entities.values()).map(cloneEntity)
        });
    }

    sendTileUpdate(event: TileUpdatedEvent) {
        this.send({ type: "tile", tile: { ...event.tile, data: cloneData(event.tile.data) } });
    }

    private send(message: GameMessage) {
        this.worker?.postMessage(message);
    }

    private sendAdd(ev: EntityAddedEvent) {
        this.send({
            type: "entityAdd",
            entity: {
                id: ev.entity.id,
                type: ev.entity.type,
                radius: ev.entity.radius,
                position: ev.entity.position,
                energy: ev.entity.energy
            }
        });
    }

    private sendMove(ev: EntityPositionUpdatedEvent) {
        this.send({ type: "entityPositionUpdate", id: ev.id, position: { ...ev.position } });
    }

    private sendEnergy(ev: EntityEnergyUpdatedEvent) {
        this.send({ type: "entityEnergyUpdate", id: ev.id, energy: ev.energy });
    }

    private sendRemove(ev: EntityRemovedEvent) {
        this.send({ type: "entityRemove", id: ev.id });
    }

    private sendItemUpdate(ev: ItemUpdatedEvent) {
        this.send({ type: "itemUpdate", item: ev.item });
    }

    private sendMagicReady(bot: BotInstance) {
        this.send({ type: "bot", name: bot.name, response: { type: "magicReady" } });
    }

    tick(deltaSeconds: number): void {
        for (const bot of this.bots.values()) {
            const tile = this.board.getTileAt(bot.position.x, bot.position.y);
            this.depleteEnergy(bot, deltaSeconds * (tile.data?.type === "chargingStation" ? -0.01 : 0.001));
            const couldUseMagic = bot.magicCooldown <= 0;
            bot.magicCooldown -= deltaSeconds;
            if (bot.magicCooldown <= 0 && !couldUseMagic)
                this.sendMagicReady(bot);
        }
    }

    private depleteEnergy(bot: BotInstance, amount: number) {
        if (!bot.energy && amount > 0 || bot.energy < amount)
            return false;
        bot.energy = Math.max(0, Math.min(1, bot.energy - amount));
        this.send({ type: "bot", name: bot.name, response: { type: "energy", amount } });
        return true;
    }
}

function toInitialData(bot: BotInstance): InitialBotData {
    return {
        name: bot.name,
        position: { ...bot.position },
        inventory: Array.from(bot.inventory.entries()),
        energy: bot.energy,
        magicReady: bot.magicCooldown <= 0
    };
}
