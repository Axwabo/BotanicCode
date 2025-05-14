import { render } from "./renderer.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";

const { game } = storeToRefs(useGameStore());

export default function loop() {
    render();
    requestAnimationFrame(loop);
}

window.addEventListener("keydown", handleKey);

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
