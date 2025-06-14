import { defineStore } from "pinia";
import type { GameState } from "./game/gameState.ts";
import BotManager from "./game/botManager.ts";
import useEditorStore from "./editorStore.ts";
import type { WorldPosition } from "./util/tile";
import ManagedBoard from "./game/managedBoard.ts";
import { createChicken, createCow, createPig, createSheep } from "./game/entities/create.ts";
import { plant } from "./game/plants/create.ts";

interface Renderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

interface State {
    renderer: Renderer | undefined;
    game: GameState;
    dragging: boolean;
    uiEventsRegistered: boolean;
    pointer: WorldPosition;
    workerReady: boolean;
    workerError: any | undefined;
}

function createBoard() {
    const board = new ManagedBoard();
    board.getTile(-1, 1).type = "gravel";
    board.getTile(0, 1).type = "gravel";
    board.getTile(1, 1).type = "gravel";
    board.getTile(-1, 2).type = "dirt";
    board.getTile(0, 2).type = "dirt";
    board.getTile(1, 2).type = "dirt";
    board.getTile(10, 10).data = { type: "chargingStation" };
    plant(board, 0, 2, "wheat");
    plant(board, 1, 2, "carrot");
    plant(board, 2, 2, "potato");
    plant(board, 3, 2, "tomato");
    plant(board, 4, 2, "strawberry");
    createCow(board, { x: 20, y: 40 });
    createPig(board, { x: -20, y: -40 });
    createSheep(board, { x: 20, y: -40 });
    createChicken(board, { x: -20, y: 40 });
    return board;
}

const useGameStore = defineStore("game", {
    state: (): State => {
        const board = createBoard();
        return {
            renderer: undefined,
            game: {
                board,
                position: {
                    x: 0,
                    y: 0
                },
                zoom: 1,
                botManager: new BotManager(board),
                loadedChunks: new Set()
            },
            dragging: false,
            uiEventsRegistered: false,
            pointer: {
                x: 0,
                y: 0
            },
            workerReady: false,
            workerError: undefined
        };
    },
    actions: {
        resetPosition() {
            this.game.position.x = 0;
            this.game.position.y = 0;
        },
        resetBoard() {
            useEditorStore().selectedBot = "";
            this.game.botManager.terminate();
            this.game.board = createBoard();
            this.game.zoom = 1;
            this.workerReady = false;
        }
    }
});

export default useGameStore;
