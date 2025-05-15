import type { Board } from "../util/world/board.js";
import type Bot from "./bot.ts";

export interface GameState {
    board: Board;
    position: {
        x: number
        y: number
    };
    bots: Map<string, Bot>;
}
