import type { Board } from "./board.ts";

export interface GameState {
    board: Board;
    position: {
        x: number
        y: number
    }
}
