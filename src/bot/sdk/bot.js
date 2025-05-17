import sendMessage from "./message.js";

/** @type {Map<string, Bot>} */
const bots = new Map();

export class Bot {
    /** @type {string} */
    #name;
    /** @type {WorldPosition} */
    position;

    /** @param name {string} */
    constructor(name) {
        this.#name = name;
        this.position = { x: 0, y: 0 };
        bots.set(name, this);
        this.request({ type: "create" });
    }

    get name() {
        return this.#name;
    }

    /** @param request {BotRequest} */
    request(request) {
        sendMessage({ type: "bot", name: this.#name, request });
    }

    terminate() {
        this.request({ type: "terminate" });
    }
}

export function createBot(name) {
    return bots.get(name) ?? new Bot(name);
}

export function getBot(name) {
    return bots.get(name);
}

/** @returns {MapIterator<Bot>} */
export function iterateBots() {
    return bots.values();
}

