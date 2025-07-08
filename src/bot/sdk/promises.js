import { signalReady } from "./ready.js";

const loadWorldPromise = new Promise(resolve => addEventListener(
    "worldloaded",
    /** @param e {WorldLoadedEvent} */e => resolve(e.board),
    true
));

/** @returns {Promise<Board>} */
export function loadWorld() {
    signalReady();
    return loadWorldPromise;
}

/** @returns {Promise<number>} */
export function nextFrame() {
    return new Promise(resolve => addEventListener("render", /**@param e {RenderEvent} */e => resolve(e.deltaTime), true));
}

export function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
