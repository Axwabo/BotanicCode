import { editorHandler } from "./main.ts";
import BotReadyEvent from "./botReadyEvent.ts";
import type { Board } from "../util/world/board";
import type { WorkerMessage } from "../util/messages";
import type { Position } from "../util/tile";

export default class BotManager {
    readonly name: string;
    private readonly worker: Worker;
    private readonly renderCallback: () => void;
    position: Position;
    private ready = false;
    private _error?: any;

    constructor(name: string, entryPoint: string) {
        this.name = name;
        this.worker = new Worker(`bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint)}`, { type: "module" });
        this.position = { x: 0, y: 0 };
        this.renderCallback = () => this.worker.postMessage({ type: "render" });
        this.worker.addEventListener("message", event => this.handleMessage(event));
        editorHandler.addEventListener("render", this.renderCallback);
    }

    private handleMessage(event: MessageEvent<WorkerMessage>) {
        if (!event.data)
            return;
        switch (event.data.type) {
            case "error":
                console.error(event.data.error);
                this._error = event.data.error;
                break;
            case "ready":
                if (this.ready)
                    break;
                this.ready = true;
                editorHandler.dispatchEvent(new BotReadyEvent(this.name));
                break;
            case "move":
                this.position.x += event.data.x;
                this.position.y += event.data.y;
                break;
        }
    }

    terminate() {
        editorHandler.removeEventListener("render", this.renderCallback);
        this.worker.terminate();
    }

    sendBoard(board: Board) {
        this.worker.postMessage({ type: "world", board: JSON.stringify(board.chunkStore) });
    }

    get isReady() {
        return this.ready;
    }

    get error() {
        return this._error;
    }
}
