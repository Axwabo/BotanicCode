import useGameStore from "../gameStore.ts";
import { storeToRefs } from "pinia";
import type { GameState } from "./gameState.ts";

const { renderer, game, pointer } = storeToRefs(useGameStore());

interface ContextAttributes {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    game: GameState;
    pointerX: number;
    pointerY: number;
}

export default function getContext(): ContextAttributes {
    const currentRenderer = renderer.value;
    if (!currentRenderer)
        throw new Error("Renderer is not initialized");
    const { x, y } = pointer.value;
    return {
        ctx: currentRenderer.context,
        width: currentRenderer.canvas.width,
        height: currentRenderer.canvas.height,
        game: game.value,
        pointerX: x,
        pointerY: y
    };
}

export function canvasToWorld(pointerX: number, pointerY: number) {
    const currentRenderer = renderer.value;
    if (!currentRenderer)
        throw new Error("Renderer is not initialized");
    const { x, y } = game.value.position;
    return {
        x: pointerX + x - currentRenderer.canvas.width * 0.5,
        y: pointerY + y - currentRenderer.canvas.height * 0.5
    };
}
