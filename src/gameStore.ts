import { defineStore } from "pinia";
import type { GameState } from "./game/gameState.ts";
import { Board } from "./util/world/board.js";
import type Bot from "./game/bot.ts";

interface Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

interface State {
    renderer: Renderer | undefined;
    game: GameState;
    dragging: boolean;
    uiEventsRegistered: boolean;
    pointer: {
        x: number,
        y: number
    }
}

function createBoard() {
    const board = new Board();
    board.getTile(-1, 1).type = "gravel";
    board.getTile(0, 1).type = "gravel";
    board.getTile(1, 1).type = "gravel";
    board.getTile(-1, 2).type = "dirt";
    board.getTile(0, 2).type = "dirt";
    board.getTile(1, 2).type = "dirt";
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
            },
            bots: new Map<string, Bot>()
        },
        dragging: false,
        uiEventsRegistered: false,
        pointer: {
            x: 0,
            y: 0
        }
    }),
    actions: {
        resetPosition() {
            this.game.position.x = 0;
            this.game.position.y = 0;
        },
        resetBoard() {
            for (const agent of this.game.bots.values())
                agent.terminate();
            this.game.bots.clear();
            this.game.board = createBoard();
        }
    }
});

export default useGameStore;
