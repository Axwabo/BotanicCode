import type { Board } from "../util/world/board";
import type { GameMessage, WorkerMessage } from "../util/messages";
import type { WorldPosition } from "../util/tile";
import type { BotRequest } from "../bot/sdk/requests";
import { editorHandler } from "./editorHandler.ts";
import WorkerErrorEvent from "./events/workerErrorEvent.ts";
import type TerminatingBotEvent from "./events/terminatingBotEvent.ts";

export default class BotManager {
    private readonly worker?: Worker;
    private readonly renderCallback?: () => void;
    private readonly terminateCallback?: (event: Event) => void;
    readonly bots: Map<string, WorldPosition>; // TODO: managed bot instance

    constructor(entryPoint?: string) {
        editorHandler.dispatchEvent(new Event("workerinit"));
        this.bots = new Map<string, WorldPosition>();
        if (!entryPoint)
            return;
        this.worker = new Worker(`bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint)}`, { type: "module" });
        this.renderCallback = () => this.send({ type: "render" });
        this.terminateCallback = event => this.send({ type: "bot", name: (<TerminatingBotEvent>event).name, response: { type: "terminate" } });
        this.worker.addEventListener("message", event => this.handleMessage(event));
        editorHandler.addEventListener("render", this.renderCallback);
        editorHandler.addEventListener("terminatingbot", this.terminateCallback);
    }

    private handleMessage(event: MessageEvent<WorkerMessage>) {
        if (!event.data)
            return;
        switch (event.data.type) {
            case "error":
                editorHandler.dispatchEvent(new WorkerErrorEvent(event.data.error));
                break;
            case "ready":
                editorHandler.dispatchEvent(new Event("workerready"));
                break;
            case "bot":
                this.handleRequest(event.data.request, event.data.name);
                break;
        }
    }

    private handleRequest(request: BotRequest, name: string) {
        if (request.type === "create") {
            this.bots.set(name, { x: 0, y: 0 });
            return;
        }
        const bot = this.bots.get(name);
        if (!bot)
            return;
        switch (request.type) {
            case "move":
                bot.x += request.deltaX;
                bot.y += request.deltaY;
                break;
            case "terminate":
                this.bots.delete(name);
                break;
        }
    }

    terminate() {
        if (this.renderCallback)
            editorHandler.removeEventListener("render", this.renderCallback);
        if (this.terminateCallback)
            editorHandler.removeEventListener("terminatingbot", this.terminateCallback);
        this.worker?.terminate();
        this.bots.clear();
    }

    sendBoard(board: Board) {
        this.send({ type: "world", board: JSON.stringify(board.chunkStore) });
    }

    private send(message: GameMessage) {
        this.worker?.postMessage(message);
    }
}
