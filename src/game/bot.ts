export default class Bot {
    private readonly worker: Worker;
    position: { x: number; y: number; };

    constructor(entryPoint: string) {
        this.worker = new Worker(`bot/sdk/run.js?t=${Date.now()}&entryPoint=${encodeURI(entryPoint)}`, { type: "module" });
        this.position = { x: 0, y: 0 };
        this.worker.addEventListener("message", console.log /*TODO*/);
    }

    terminate() {
        this.worker.terminate();
    }
}
