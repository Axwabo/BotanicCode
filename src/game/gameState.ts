import type { Board } from "./board.ts";
import type Bot from "./bot/bot.ts";

export interface GameState {
    board: Board;
    position: {
        x: number
        y: number
    };
    agents: Map<string, Bot>;
}
