export function signalReady() {
    postMessage({ type: "ready" });
}

export function signalError(error) {
    postMessage({ type: "error", error });
}
