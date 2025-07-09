import getContext, { canvasToWorld } from "../ctx.ts";
import { tileSize, worldToChunk } from "../../util/tileConstants.js";
import type { Gizmo } from "../../util/gizmos";
import { editorHandler } from "../events/editorHandler.ts";
import { fillCircle } from "./shapes.ts";
import { drawEntities } from "./entities.ts";
import { drawViewportChunks, viewportChunks } from "./chunks.ts";
import type { Tool } from "../editor/editorTypes.ts";
import { drawBots } from "./bo.ts";
import { highlightOverlay } from "./colors.ts";

const gizmos: Gizmo[] = [];

editorHandler.addEventListener("cleargizmos", () => gizmos.length = 0);
editorHandler.addEventListener("addgizmos", ev => gizmos.push(...ev.gizmos));

function clearAndTransform(ctx: CanvasRenderingContext2D, width: number, height: number, x: number, y: number, zoom: number) {
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(Math.round(-x * zoom), Math.round(-y * zoom));
    ctx.translate(Math.round(width * 0.5), Math.round(height * 0.5));
    ctx.scale(zoom, zoom);
}

export function render() {
    const { ctx, width, height, game, pointerX, pointerY, tool, selectedBot } = getContext();
    const { x, y } = game.position;
    clearAndTransform(ctx, width, height, x, y, game.zoom);
    const { startX, startY, endX, endY } = viewportChunks(x, y, width, height, game.zoom);
    const { x: pointerWorldX, y: pointerWorldY } = canvasToWorld(pointerX, pointerY);
    drawViewportChunks(ctx, game, startX, endX, startY, endY);
    drawEntities(ctx, game.board.entities, startX, startY, endX, endY, pointerWorldX, pointerWorldY, tool);
    drawBots(ctx, game.botManager.bots, selectedBot, tool, pointerWorldX, pointerWorldY);
    drawGizmos(ctx);
    highlightTile(ctx, tool, pointerWorldX, pointerWorldY);
    drawHud(ctx, x, y, game.zoom);
}

function drawGizmos(ctx: CanvasRenderingContext2D) {
    for (const gizmo of gizmos) {
        ctx.fillStyle = gizmo.color;
        ctx.strokeStyle = gizmo.color;
        const { x, y } = gizmo.position;
        switch (gizmo.type) {
            case "point":
                fillCircle(ctx, x, y, gizmo.radius);
                break;
            case "rectangle":
                ctx.fillRect(x, y, gizmo.width, gizmo.height);
                break;
            case "line":
                ctx.lineWidth = gizmo.width;
                ctx.beginPath();
                ctx.moveTo(x, y);
                for (const { x, y } of gizmo.points)
                    ctx.lineTo(x, y);
                ctx.stroke();
                break;
        }
    }
}

function highlightTile(ctx: CanvasRenderingContext2D, tool: Tool, pointerWorldX: number, pointerWorldY: number) {
    if (tool === "Inspector" || isNaN(pointerWorldX) || isNaN(pointerWorldY))
        return;
    ctx.fillStyle = highlightOverlay;
    ctx.fillRect(Math.floor(pointerWorldX / tileSize) * tileSize, Math.floor(pointerWorldY / tileSize) * tileSize, tileSize, tileSize);
}

function drawHud(ctx: CanvasRenderingContext2D, x: number, y: number, zoom: number) {
    ctx.resetTransform();
    ctx.font = "20px monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(`X: ${x} (chunk: ${Math.floor(worldToChunk(x))})`, 5, 5);
    ctx.fillText(`Y: ${y} (chunk: ${Math.floor(worldToChunk(y))})`, 5, 25);
    ctx.fillText(`Zoom: ${zoom.toFixed(1)}x`, 5, 45);
}
