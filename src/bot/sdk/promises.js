import { signalReady } from "./ready.js";

export function loadWorld() {
    signalReady();
    return new Promise(resolve => addEventListener(
        "worldloaded",
        /** @param e {WorldLoadedEvent} */e => resolve(e.board),
        true
    ));
}

export function nextFrame() {
    return new Promise(resolve => addEventListener("render", resolve, true));
}
