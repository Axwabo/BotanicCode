import sendMessage from "./message.js";
import { validateMove } from "../../util/movement.js";

/** @type {Map<string, Bot>} */
const bots = new Map();

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
        this.#request({ type: "create" });
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
        const { x, y, valid } = validateMove(this.#board, this.position, deltaX, deltaY);
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

    terminate() {
        this.#terminated = true;
        this.#request({ type: "terminate" });
    }

    get isTerminated() {
        return this.#terminated;
    }
}

/**
 * @param board {Board}
 * @param name {string}
 * @return {Bot}
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

