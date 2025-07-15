export default class MagicReadyEvent extends Event {
    /** @type {string} */
    bot;

    /** @param bot {string} */
    constructor(bot) {
        super("magicready");
        this.bot = bot;
    }
}
