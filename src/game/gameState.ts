import type { Board } from "../util/world/board.js";
import type BotManager from "./botManager.ts";
import type { WorldPosition } from "../util/tile";

export interface GameState {
    board: Board;
    position: WorldPosition;
    botManager: BotManager;
}
