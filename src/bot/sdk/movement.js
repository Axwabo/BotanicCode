import sendMessage from "./message.js";

export function moveBy(x, y) {
    sendMessage({ type: "move", x, y });
}
