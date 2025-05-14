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
                chunks: [ {
                    x: 0,
                    y: 0,
                    rows: [ {
                        chunkY: 0,
                        tiles: [ {
                            worldX: 0,
                            worldY: 0,
                            type: "grass"
                        }, {
                            worldX: 1,
                            worldY: 0,
                            type: "dirt"
                        } ]
                    } ]
                } ]
            },
            position: {
                x: 0,
                y: 0
            }
        }
    })
});

export default useGameStore;
