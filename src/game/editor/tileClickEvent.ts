import { type Board } from "../board.ts";

export default class TileClickEvent extends Event {
    readonly board: Board;
    readonly tileX: number;
    readonly tileY: number;

    constructor(board: Board, tileX: number, tileY: number) {
        super("tileclick");
        this.board = board;
        this.tileX = tileX;
        this.tileY = tileY;
    }
}
