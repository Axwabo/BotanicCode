import { Event } from "monaco-editor/esm/vs/base/common/event.js";

export default class MagicReadyEvent extends Event {
    /** @type {string} */
    bot;

    /** @param bot {string} */
    constructor(bot) {
        super("magicready");
        this.bot = bot;
    }
}
