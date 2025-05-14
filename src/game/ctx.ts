import useGameStore from "../gameStore.ts";
import { storeToRefs } from "pinia";
import type { GameState } from "./gameState.ts";

const { renderer, game } = storeToRefs(useGameStore());

interface ContextAttributes {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    game: GameState
}

export default function getContext(): ContextAttributes {
    const currentRenderer = renderer.value;
    if (!currentRenderer)
        throw new Error("Renderer is not initialized");
    return {
        ctx: currentRenderer.context,
        width: currentRenderer.canvas.width,
        height: currentRenderer.canvas.height,
        game: game.value
    };
}
