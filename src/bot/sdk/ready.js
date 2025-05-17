import sendMessage from "./message.js";

export function signalReady() {
    sendMessage({ type: "ready" });
}

export function signalError(error) {
    sendMessage({ type: "error", error });
}
