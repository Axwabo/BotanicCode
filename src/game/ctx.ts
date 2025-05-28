import useGameStore from "../gameStore.ts";
import { storeToRefs } from "pinia";
import type { GameState } from "./gameState.ts";
import useEditorStore from "../editorStore.ts";
import type { Tool } from "./editor/editorTypes.ts";

const { renderer, game, pointer } = storeToRefs(useGameStore());

const { tool } = storeToRefs(useEditorStore());

interface ContextAttributes {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    game: GameState;
    pointerX: number;
    pointerY: number;
    tool: Tool;
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
        pointerY: y,
        tool: tool.value
    };
}

export function canvasToWorld(pointerX: number, pointerY: number) {
    const currentRenderer = renderer.value;
    if (!currentRenderer)
        throw new Error("Renderer is not initialized");
    const { zoom, position: { x, y } } = game.value;
    return {
        x: (pointerX + x - currentRenderer.canvas.width * 0.5) / zoom,
        y: (pointerY + y - currentRenderer.canvas.height * 0.5) / zoom
    };
}
