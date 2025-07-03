import sendMessage from "./message.js";

export function signalReady() {
    sendMessage({ type: "ready" });
}

/**
 * @param error {any}
 * @param fatal {boolean}
 */
export function signalError(error, fatal = true) {
    sendMessage({ type: "error", error, fatal });
}
