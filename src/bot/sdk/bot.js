import sendMessage from "./message.js";
import { validateMove } from "../../util/movement.js";
import { tileSize } from "../../util/tileConstants.js";
import { modifyInventory } from "../../util/inventoryHelper.js";

export const botRadius = tileSize * 0.4;

/** @type {Map<string, Bot>} */
const bots = new Map();
/** @type {Map<string, Inventory>} */
const inventories = new Map();
/** @type {Map<string, number>} */
const energy = new Map();
/** @type {Set<string>} */
const magicReady = new Set();

let initial = false;

class Bot {

    /** @type {string} */
    #name;
    /** @type {WorldPosition} */
    position;
    /** @type {Board} */
    #board;
    #terminated = false;

    /**
     * @param name {string}
     * @param board {Board}
     * */
    constructor(name, board) {
        this.#name = name;
        this.#board = board;
        this.position = { x: 0, y: 0 };
        bots.set(name, this);
        inventories.set(name, new Map());
        energy.set(name, 1);
        if (!initial)
            this.#request({ type: "create" });
        initial = false;
    }

    get name() {
        return this.#name;
    }

    /** @param request {BotRequest} */
    #request(request) {
        sendMessage({ type: "bot", name: this.#name, request });
    }

    /**
     * @param deltaX {number}
     * @param deltaY {number}
     * @return {boolean}
     */
    move(deltaX, deltaY) {
        const { x, y, valid } = validateMove(this.#board, this.position, deltaX, deltaY, botRadius);
        if (valid)
            this.#request({ type: "move", deltaX, deltaY });
        else {
            const dx = x - this.position.x;
            const dy = y - this.position.y;
            this.#request({ type: "move", deltaX: dx, deltaY: dy });
        }
        this.position.x = x;
        this.position.y = y;
        return valid;
    }

    harvest() {
        this.#request({ type: "harvest" });
    }

    /** @param plantType {Plantable} */
    plant(plantType) {
        this.#request({ type: "plant", kind: plantType });
    }

    /**
     * @param itemType {ItemType}
     * @param amount {number}
     */
    drop(itemType, amount) {
        if (amount <= 0)
            return;
        const available = this.inventory?.get(itemType) ?? 0;
        amount = Math.min(available, Math.max(0, amount));
        if (amount)
            this.#request({ type: "drop", item: itemType, amount });
    }

    terminate() {
        this.#terminated = true;
        this.#request({ type: "terminate" });
        inventories.delete(this.name);
        energy.delete(this.name);
    }

    get isTerminated() {
        return this.#terminated;
    }

    /** @returns {Inventory} */
    get inventory() {
        return inventories.get(this.name);
    }

    /** @returns {number} */
    get energy() {
        return energy.get(this.name) ?? 0;
    }

    get canUseMagic() {
        return magicReady.has(this.name);
    }

    /** @param entityOrTile {Entity | Tile} */
    magic(entityOrTile) {
        if (!this.canUseMagic)
            return;
        magicReady.delete(this.name);
        this.#request({ type: "magic", target: entityOrTile });
    }
}

/**
 * @param board {Board}
 * @param name {string}
 * @returns {Bot}
 */
export function createBot(board, name) {
    return bots.get(name) ?? new Bot(name, board);
}

export function getBot(name) {
    return bots.get(name);
}

/** @returns {MapIterator<Bot>} */
export function iterateBots() {
    return bots.values();
}

addEventListener("pickup", /** @param ev {PickUpEvent} */ev => {
    const inventory = inventories.get(ev.botName);
    if (inventory)
        modifyInventory(inventory, ev.itemType, ev.count);
});

addEventListener("energydepletion", /** @param ev {EnergyDepletionEvent} */ev => {
    const current = energy.get(ev.botName) ?? 0;
    energy.set(ev.botName, Math.max(0, Math.min(1, current - ev.amount)));
});

addEventListener("worldloaded", /** @param ev {WorldLoadedEvent} */ev => {
    for (const bot of ev.bots) {
        initial = true;
        const instance = new Bot(bot.name, ev.board);
        instance.position = bot.position;
        bots.set(bot.name, instance);
        inventories.set(bot.name, new Map(bot.inventory));
        energy.set(bot.name, bot.energy);
    }
});

addEventListener("magicready", /** @param ev {MagicReadyEvent} */ev => magicReady.add(ev.bot));
