import type { Board } from "../util/world/board.js";
import type BotManager from "./botManager.ts";
import type { Position } from "../util/tile";

export interface GameState {
    board: Board;
    position: Position;
    botManager: BotManager;
}
