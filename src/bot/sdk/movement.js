export function moveBy(x, y) {
    postMessage({ type: "move", x, y });
}
