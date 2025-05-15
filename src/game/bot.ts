import { editorHandler } from "./main.ts";
import BotReadyEvent from "./botReadyEvent.ts";
import type { Board } from "../util/world/board";

export default class Bot {
    readonly name: string;
    private readonly worker: Worker;
    private readonly renderCallback: () => void;
    position: { x: number; y: number; };
    private ready = false;
    private errored = false;

    constructor(name: string, entryPoint: string) {
        this.name = name;
        this.worker = new Worker(`bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint)}`, { type: "module" });
        this.position = { x: 0, y: 0 };
        this.renderCallback = () => this.worker.postMessage({ type: "render" });
        this.worker.addEventListener("message", event => this.handleMessage(event));
        editorHandler.addEventListener("render", this.renderCallback);
    }

    private handleMessage(event: MessageEvent) {
        if (!event.data)
            return;
        switch (event.data.type) {
            case "error":
                // TODO: present error as a non-blocking operation (e.g. toast)
                alert(`Worker "${this.name}" failed to initialize. Check the console for details.`);
                console.error(event.data.error);
                this.errored = true;
                break;
            case "ready":
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

    get isError() {
        return this.errored;
    }
}
