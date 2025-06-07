export default class WorldLoadedEvent extends Event {
    /** @type {Board} */
    board;

    /** @param board {Board} */
    constructor(board) {
        super("worldloaded");
        this.board = board;
    }
}
