export default class WorldLoadedEvent extends Event {
    /** @type {Board} */
    board;
    /** @type {InitialBotData[]} */
    bots;

    /**
     * @param board {Board}
     * @param bots {InitialBotData[]}
     */
    constructor(board, bots) {
        super("worldloaded");
        this.board = board;
        this.bots = bots;
    }
}
