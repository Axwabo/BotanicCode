const isWorker = !("window" in globalThis);

export default isWorker;
