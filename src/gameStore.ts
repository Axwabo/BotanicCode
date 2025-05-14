import { defineStore } from "pinia";
import type { GameState } from "./game/gameState.ts";

interface Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

interface State {
    renderer: Renderer | undefined;
    game: GameState;
}

const useGameStore = defineStore("game", {
    state: (): State => ({
        renderer: undefined,
        game: {
            board: {
                chunks: []
            },
            position: {
                x: 0,
                y: 0
            }
        }
    })
});

export default useGameStore;
