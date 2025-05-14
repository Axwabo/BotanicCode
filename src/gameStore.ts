import { defineStore } from "pinia";
import type { GameState } from "./game/gameState.ts";
import { Board } from "./game/board.ts";

interface Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

interface State {
    renderer: Renderer | undefined;
    game: GameState;
}

function createBoard() {
    const board = new Board();
    board.getTile(-1, 1).type = "grass";
    board.getTile(0, 1).type = "grass";
    board.getTile(1, 1).type = "grass";
    board.getTile(-1, 2).type = "dirt";
    board.getTile(-2, 2).type = "dirt";
    board.getTile(0, 2).type = "dirt";
    board.getTile(1, 2).type = "dirt";
    board.getTile(2, 2).type = "dirt";
    return board;
}

const useGameStore = defineStore("game", {
    state: (): State => ({
        renderer: undefined,
        game: {
            board: createBoard(),
            position: {
                x: 0,
                y: 0
            }
        }
    })
});

export default useGameStore;
