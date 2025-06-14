import type { Board } from "../util/world/board";
import type { GameMessage, WorkerMessage } from "../util/messages";
import type { BotRequest } from "../bot/sdk/requests";
import { editorHandler } from "./events/editorHandler.ts";
import WorkerErrorEvent from "./events/workerErrorEvent.ts";
import { validateMove } from "../util/movement";
import TileUpdatedEvent from "../util/world/events/tileUpdatedEvent";
import cloneData from "./cloneData.ts";
import { reactive } from "vue";
import AddGizmosEvent from "./events/addGizmosEvent.ts";
import { type BotInstance } from "./botInstance.ts";
import type ManagedBoard from "./managedBoard.ts";
import type EntityAddedEvent from "../util/world/events/entityAddedEvent";
import type EntityPositionUpdatedEvent from "../util/world/events/entityPositionUpdatedEvent";
import type EntityRemovedEvent from "../util/world/events/entityRemovedEvent";
import { botRadius } from "../bot/sdk/bot.js";
import { plant } from "./plants/create.ts";
import { worldToTile } from "../util/tileConstants";
import { modifyInventory } from "../util/inventoryHelper";

type EventHandler<T> = (event: T) => void;

interface EventHandlers {
    render: () => void;
    entityAdded: EventHandler<EntityAddedEvent>;
    entityPositionUpdated: EventHandler<EntityPositionUpdatedEvent>;
    entityRemoved: EventHandler<EntityRemovedEvent>;
}

export default class BotManager {
    private readonly board: ManagedBoard;
    private readonly worker?: Worker;
    private readonly handlers?: EventHandlers;
    readonly bots: Map<string, BotInstance>;

    constructor(board: ManagedBoard, entryPoint?: string) {
        editorHandler.dispatchEvent(new Event("workerinit"));
        this.board = board;
        this.bots = new Map<string, BotInstance>();
        if (!entryPoint)
            return;
        this.worker = new Worker(`${import.meta.env.BASE_URL}bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint.replace(/^\//, ""))}`, { type: "module" });
        const callbacks: EventHandlers = {
            render: () => this.send({ type: "render" }),
            entityAdded: ev => this.sendAdd(ev),
            entityPositionUpdated: ev => this.sendMove(ev),
            entityRemoved: ev => this.sendRemove(ev)
        };
        this.handlers = callbacks;
        this.worker.addEventListener("message", event => this.handleMessage(event));
        editorHandler.addEventListener("render", callbacks.render);
        board.addEventListener("entityadded", callbacks.entityAdded);
        board.addEventListener("entitypositionupdated", callbacks.entityPositionUpdated);
        board.addEventListener("entityremoved", callbacks.entityRemoved);
    }

    private handleMessage(event: MessageEvent<WorkerMessage>) {
        if (!event.data)
            return;
        switch (event.data.type) {
            case "error":
                editorHandler.dispatchEvent(new WorkerErrorEvent(event.data.error));
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
                chunkSeconds: new Map()
            });
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
            case "terminate":
                this.bots.delete(name);
                break;
            case "harvest": {
                const tile = this.board.getTileAt(position.x, position.y);
                const data = tile.data;
                if (!data || !("growthPercentage" in data))
                    break;
                const count = Math.floor(5 * data.growthPercentage);
                if (count === 0)
                    break;
                modifyInventory(bot.inventory, data.type, count);
                this.send({ type: "bot", name, response: { type: "pickUp", item: data.type, count } });
                tile.data = undefined;
                editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
                break;
            }
            case "plant": {
                const amount = bot.inventory.get(request.kind) ?? 0;
                if (amount <= 0 || !plant(this.board, Math.floor(worldToTile(position.x)), Math.floor(worldToTile(position.y)), request.kind))
                    break;
                modifyInventory(bot.inventory, request.kind, -1);
                this.send({ type: "bot", name, response: { type: "pickUp", item: request.kind, count: -1 } });
                break;
            }
        }
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
        }
        this.worker?.terminate();
        this.bots.clear();
    }

    sendBoard(board: Board) {
        this.send({ type: "world", board: JSON.stringify(board.chunkStore) });
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
                position: ev.entity.position
            }
        });
    }

    private sendMove(ev: EntityPositionUpdatedEvent) {
        this.send({ type: "entityUpdate", id: ev.id, position: { ...ev.position } });
    }

    private sendRemove(ev: EntityRemovedEvent) {
        this.send({ type: "entityRemove", id: ev.id });
    }
}
