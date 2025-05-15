import { editorHandler } from "./main.ts";

export default class Bot {
    private readonly worker: Worker;
    private readonly renderCallback: () => void;
    position: { x: number; y: number; };

    constructor(entryPoint: string) {
        this.worker = new Worker(`bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint)}`, { type: "module" });
        this.position = { x: 0, y: 0 };
        this.renderCallback = () => this.worker.postMessage({ type: "render" });
        this.worker.addEventListener("message", event => this.handleMessage(event));
        editorHandler.addEventListener("render", this.renderCallback);
    }

    private handleMessage(event: MessageEvent) {
        if (event.data?.type !== "move")
            return;
        this.position.x += event.data.x;
        this.position.y += event.data.y;
    }

    terminate() {
        editorHandler.removeEventListener("render", this.renderCallback);
        this.worker.terminate();
    }
}
