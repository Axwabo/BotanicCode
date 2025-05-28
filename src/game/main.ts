import { render } from "./renderer.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";
import { canvasToWorld } from "./ctx.ts";
import ClickEvent from "./events/clickEvent.ts";
import { editorHandler } from "./events/editorHandler.ts";
import type WorkerErrorEvent from "./events/workerErrorEvent.ts";
import type TileUpdatedEvent from "../util/world/events/tileUpdatedEvent";
import tick from "./tick.ts";

const {
    game,
    dragging,
    uiEventsRegistered,
    pointer,
    workerReady,
    workerError
} = storeToRefs(useGameStore());

let previousTimestamp = 0;

export default function beginLoop() {
    if (uiEventsRegistered.value)
        return;
    uiEventsRegistered.value = true;

    window.addEventListener("keydown", handleKey);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);

    editorHandler.addEventListener("workerinit", resetWorkerState);
    editorHandler.addEventListener("workerready", sendBoard);
    editorHandler.addEventListener("workererror", setError);

    editorHandler.addEventListener("tileupdated", updateTile);

    previousTimestamp = performance.now();
    requestAnimationFrame(loop);
}

function loop(timestamp: number) {
    const delta = (timestamp - previousTimestamp) * 0.001;
    tick(game.value, delta);
    previousTimestamp = timestamp;
    render();
    requestAnimationFrame(loop);
    editorHandler.dispatchEvent(new Event("render"));
}

function handleKey(event: KeyboardEvent) {
    if (event.target !== document.body)
        return;
    const pos = game.value.position;
    switch (event.key) {
        case "ArrowLeft":
        case "a":
            pos.x -= 10;
            break;
        case "ArrowRight":
        case "d":
            pos.x += 10;
            break;
        case "ArrowUp":
        case "w":
            pos.y -= 10;
            break;
        case "ArrowDown":
        case "s":
            pos.y += 10;
            break;
    }
}

function notCanvas(event: MouseEvent) {
    return (event.target as HTMLCanvasElement)?.id !== "gameCanvas";
}

function handleMouseDown(event: MouseEvent) {
    if (notCanvas(event))
        return;
    if (event.button === 1)
        dragging.value = true;
    if (event.button !== 0)
        return;
    const { x, y } = canvasToWorld(event.offsetX, event.offsetY);
    editorHandler.dispatchEvent(new ClickEvent(game.value.board, x, y));
}

function handleMouseUp(event: MouseEvent) {
    if (event.button === 1)
        dragging.value = false;
}

function handleMouseMove(event: MouseEvent) {
    if (notCanvas(event))
        pointer.value.x = pointer.value.y = NaN;
    else {
        pointer.value.x = event.offsetX;
        pointer.value.y = event.offsetY;
    }
    if (!dragging.value)
        return;
    game.value.position.x -= event.movementX;
    game.value.position.y -= event.movementY;
}

function handleWheel(event: WheelEvent) {
    if (!notCanvas(event))
        game.value.zoom = Math.min(3, Math.max(0.5, game.value.zoom - Math.sign(event.deltaY) * 0.1));
}

function resetWorkerState() {
    workerReady.value = false;
    workerError.value = undefined;
}

function setError(event: WorkerErrorEvent) {
    workerError.value = event.error;
}

function sendBoard() {
    if (workerReady.value)
        return;
    workerReady.value = true;
    const { board, botManager } = game.value;
    botManager.sendBoard(board);
}

function updateTile(event: TileUpdatedEvent) {
    game.value.botManager.sendTileUpdate(event);
}
