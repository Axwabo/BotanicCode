import { render } from "./rendering/renderer.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";
import { canvasToWorld } from "./ctx.ts";
import ClickEvent from "./events/clickEvent.ts";
import { editorHandler } from "./events/editorHandler.ts";
import type WorkerErrorEvent from "./events/workerErrorEvent.ts";
import type TileUpdatedEvent from "../util/world/events/tileUpdated";
import tick from "./tick.ts";
import RenderEvent from "../util/world/events/render";
import { distance } from "../util/distance";

const {
    game,
    dragging,
    uiEventsRegistered,
    pointer,
    workerReady,
    workerError
} = storeToRefs(useGameStore());

const { stop } = useGameStore();

let previousTimestamp = 0;
let pinch = 0;

export default function beginLoop() {
    if (uiEventsRegistered.value)
        return;
    uiEventsRegistered.value = true;

    window.addEventListener("keydown", handleKey);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    editorHandler.addEventListener("workerinit", resetWorkerState);
    editorHandler.addEventListener("workerready", sendBoard);
    editorHandler.addEventListener("workererror", setError);

    editorHandler.addEventListener("tileupdated", updateTile);

    previousTimestamp = performance.now();
    requestAnimationFrame(loop);
}

function loop(timestamp: number) {
    const delta = Math.min(0.5, (timestamp - previousTimestamp) * 0.001);
    game.value.loadedChunks.clear();
    if (workerReady.value)
        tick(game.value, delta);
    previousTimestamp = timestamp;
    render();
    requestAnimationFrame(loop);
    editorHandler.dispatchEvent(new RenderEvent(delta));
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

function notCanvas(target: EventTarget | null) {
    return (target as HTMLCanvasElement)?.id !== "gameCanvas";
}

type MoveEvent = { target: EventTarget | null, offsetX: number; offsetY: number; };

function handleMouseDown(event: MouseEvent) {
    if (notCanvas(event.target))
        return;
    if (event.button === 1) {
        pointer.value.x = event.offsetX;
        pointer.value.y = event.offsetY;
        dragging.value = true;
    }
    if (event.button !== 0)
        return;
    const { x, y } = canvasToWorld(event.offsetX, event.offsetY);
    editorHandler.dispatchEvent(new ClickEvent(game.value.board, x, y));
}

function handleMouseUp(event: MouseEvent) {
    if (event.button === 1)
        dragging.value = false;
}

function handleMouseMove(event: MoveEvent) {
    const { x, y } = pointer.value;
    if (notCanvas(event.target))
        pointer.value.x = pointer.value.y = NaN;
    else {
        pointer.value.x = event.offsetX;
        pointer.value.y = event.offsetY;
    }
    if (!dragging.value)
        return;
    game.value.position.x -= isNaN(x) ? 0 : event.offsetX - x;
    game.value.position.y -= isNaN(y) ? 0 : event.offsetY - y;
}

function zoom(delta: number) {
    const previousZoom = game.value.zoom;
    game.value.zoom = Math.min(3, Math.max(0.5, previousZoom - Math.sign(delta) * 0.1));
}

function handleWheel(event: WheelEvent) {
    if (notCanvas(event.target))
        return;
    event.stopPropagation();
    const previousWorld = canvasToWorld(event.offsetX, event.offsetY);
    zoom(event.deltaY);
    const currentWorld = canvasToWorld(event.offsetX, event.offsetY);
    game.value.position.x += Math.floor(previousWorld.x - currentWorld.x);
    game.value.position.y += Math.floor(previousWorld.y - currentWorld.y);
}

function relative(event: TouchEvent) {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas || event.target !== canvas)
        return;
    const { x, y } = canvas.getBoundingClientRect();
    const { pageX, pageY, target } = event.changedTouches.item(0)!;
    return { target, offsetX: Math.round(pageX - x), offsetY: Math.round(pageY - y) };
}

function getDistance(touches: TouchList) {
    const start = touches.item(0)!;
    const end = touches.item(1)!;
    return distance(start.clientX, start.clientY, end.clientX, end.clientY);
}

function handleTouchStart(event: TouchEvent) {
    const transformed = relative(event);
    if (!transformed)
        return;
    if (event.touches.length > 1) {
        pinch = getDistance(event.touches);
        return;
    }
    dragging.value = true;
    pointer.value.x = transformed.offsetX;
    pointer.value.y = transformed.offsetY;
}

function handleTouchMove(event: TouchEvent) {
    const transformed = relative(event);
    if (!transformed)
        return;
    if (event.touches.length === 1) {
        handleMouseMove(transformed);
        return;
    }
    const currentPinch = getDistance(event.touches);
    zoom(pinch - currentPinch);
    pinch = currentPinch;
}

function handleTouchEnd() {
    dragging.value = false;
}

function resetWorkerState() {
    workerReady.value = false;
    workerError.value = undefined;
}

function setError(event: WorkerErrorEvent) {
    workerError.value = event.error;
    if (event.fatal)
        stop();
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
