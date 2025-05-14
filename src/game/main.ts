import { render } from "./renderer.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";
import { canvasToWorld } from "./ctx.ts";
import TileClickEvent from "./editor/tileClickEvent.ts";
import { tileSize } from "./tileConstants.ts";

const { game, dragging, uiEventsRegistered, pointer } = storeToRefs(useGameStore());

export const editorHandler = new EventTarget();

export default function beginLoop() {
    if (uiEventsRegistered.value)
        return;
    uiEventsRegistered.value = true;

    window.addEventListener("keydown", handleKey);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    loop();
}

function loop() {
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
    editorHandler.dispatchEvent(new TileClickEvent(
        game.value.board,
        Math.floor(x / tileSize),
        Math.floor(y / tileSize)
    ));
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
