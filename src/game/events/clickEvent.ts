import { type Board } from "../../util/world/board.js";
import { tileSize } from "../../util/tileConstants";

export default class ClickEvent extends Event {
    readonly board: Board;
    readonly x: number;
    readonly y: number;
    readonly tileX: number;
    readonly tileY: number;

    constructor(board: Board, x: number, y: number) {
        super("click");
        this.board = board;
        this.x = x;
        this.y = y;
        this.tileX = Math.floor(x / tileSize);
        this.tileY = Math.floor(y / tileSize);
    }
}
