import type { Board } from "../util/world/board.js";
import type Bot from "./bot.ts";
import type { Position } from "../util/tile";

export interface GameState {
    board: Board;
    position: Position;
    bots: Map<string, Bot>;
}
