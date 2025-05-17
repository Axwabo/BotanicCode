import { defineStore } from "pinia";
import type { GameState } from "./game/gameState.ts";
import { Board } from "./util/world/board.js";
import BotManager from "./game/botManager.ts";
import useEditorStore from "./editorStore.ts";
import type { WorldPosition } from "./util/tile";

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
            botManager: new BotManager()
        },
        dragging: false,
        uiEventsRegistered: false,
        pointer: {
            x: 0,
            y: 0
        },
        workerReady: false,
        workerError: undefined
    }),
    actions: {
        resetPosition() {
            this.game.position.x = 0;
            this.game.position.y = 0;
        },
        resetBoard() {
            useEditorStore().selectedBot = "";
            this.game.botManager.terminate();
            this.game.board = createBoard();
        }
    }
});

export default useGameStore;
