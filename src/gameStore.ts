import { defineStore } from "pinia";
import type { GameState } from "./game/gameState.ts";
import BotManager from "./game/botManager.ts";
import useEditorStore from "./editorStore.ts";
import type { WorldPosition } from "./util/tile";
import ManagedBoard from "./game/managedBoard.ts";
import Cow from "./game/entities/cow.ts";

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
    board.getTile(0, 2).data = {
        type: "wheat",
        ageSeconds: 0,
        tick(deltaSeconds: number) {
            this.ageSeconds += deltaSeconds;
        },
        get growthPercentage(): number {
            return Math.min(1, this.ageSeconds / 20);
        }
    };
    board.entities.add(new Cow(board, { x: 20, y: 40 }));
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
                botManager: new BotManager(board)
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
