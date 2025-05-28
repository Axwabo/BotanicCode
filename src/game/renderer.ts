import getContext, { canvasToWorld } from "./ctx.ts";
import { tileSize, worldToChunk } from "../util/tileConstants.js";
import type { Tile } from "../util/tile.d.ts";
import { isInRange } from "../util/distance";
import type { Gizmo } from "../util/gizmos";
import { editorHandler } from "./events/editorHandler.ts";
import { getBoundingBoxes } from "../util/world/boundingBoxes";
import { type BotInstance } from "./botInstance.ts";
import type { Entity } from "../bot/sdk/entities";
import { botRadius } from "../bot/sdk/bot.js";

const gizmos: Gizmo[] = [];

editorHandler.addEventListener("cleargizmos", () => gizmos.length = 0);
editorHandler.addEventListener("addgizmos", ev => gizmos.push(...ev.gizmos));

export function render() {
    const { ctx, width, height, game, pointerX, pointerY, tool } = getContext();
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(Math.floor(width * 0.5), Math.floor(height * 0.5));
    const { x, y } = game.position;
    ctx.translate(-x, -y);
    ctx.scale(game.zoom, game.zoom);
    const { startX, startY, endX, endY } = viewportChunks(x, y, width, height, game.zoom);
    for (let x = startX; x <= endX; x++)
        for (let y = startY; y <= endY; y++)
            for (const row of game.board.getChunk(x, y).rows)
                for (const tile of row.tiles)
                    drawTile(ctx, tile);
    for (const entity of game.board.entities) {
        const chunkX = worldToChunk(entity.position.x);
        const chunkY = worldToChunk(entity.position.y);
        if (chunkX >= startX - 0.5 && chunkX <= endX + 0.5 && chunkY >= startY - 0.5 && chunkY <= endY + 0.5)
            drawEntity(ctx, entity);
    }
    ctx.font = "20px monospace";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    const { x: pointerWorldX, y: pointerWorldY } = canvasToWorld(pointerX, pointerY);
    let highlightedBot: BotInstance | undefined;
    for (const bot of game.botManager.bots.values()) {
        const { x, y } = bot.position;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, botRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        if (tool === "Inspector" && isInRange(x, y, pointerWorldX, pointerWorldY, botRadius))
            highlightedBot = bot;
    }
    if (highlightedBot)
        drawHighlighted(ctx, highlightedBot);
    if (tool !== "Inspector" && !isNaN(pointerWorldX) && !isNaN(pointerWorldY)) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fillRect(Math.floor(pointerWorldX / tileSize) * tileSize, Math.floor(pointerWorldY / tileSize) * tileSize, tileSize, tileSize);
    }
    drawGizmos(ctx);
    ctx.resetTransform();
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(`X: ${x} (chunk: ${Math.floor(worldToChunk(x))})`, 5, 5);
    ctx.fillText(`Y: ${y} (chunk: ${Math.floor(worldToChunk(y))})`, 5, 25);
    ctx.fillText(`Zoom: ${game.zoom.toFixed(1)}x`, 5, 45);
}

function viewportChunks(x: number, y: number, width: number, height: number, zoom: number) {
    // TODO: fix zoom
    const chunkX = Math.floor(worldToChunk(x));
    const chunkY = Math.floor(worldToChunk(y));
    const halfWidth = width / zoom * 0.5;
    const halfHeight = height / zoom * 0.5;
    const startX = chunkX - Math.ceil(worldToChunk(halfWidth));
    const startY = chunkY - Math.ceil(worldToChunk(halfHeight));
    const endX = chunkX + Math.ceil(worldToChunk(halfWidth));
    const endY = chunkY + Math.ceil(worldToChunk(halfHeight));
    return { startX, startY, endX, endY };
}

function drawTile(ctx: CanvasRenderingContext2D, tile: Tile) {
    const x = tile.x * tileSize;
    const y = tile.y * tileSize;
    if (tile.type !== "air") {
        ctx.fillStyle = tile.type === "dirt"
            ? "brown"
            : tile.type === "gravel"
                ? "gray"
                : "green";
        ctx.fillRect(x, y, tileSize, tileSize);
    }
    const data = tile.data;
    if (!data)
        return;
    switch (data.type) {
        case "fence":
            ctx.fillStyle = "orange";
            for (const box of getBoundingBoxes(data))
                ctx.fillRect(box.x + x, box.y + y, box.width, box.height);
            break;
        case "wheat":
            ctx.fillStyle = `hsl(${120 - 60 * data.growthPercentage}, 50%, 50%)`;
            for (let i = 2; i < tileSize; i += 4)
                ctx.fillRect(x + i, y + tileSize - 2, 3, -tileSize * 0.5);
            break;
    }
}

function drawEntity(ctx: CanvasRenderingContext2D, entity: Entity) {
    switch (entity.type) {
        case "cow":
            ctx.fillStyle = "#933d00";
            break;
        case "pig":
            ctx.fillStyle = "#f99";
            break;
        case "sheep":
            ctx.fillStyle = "#ddd";
            break;
    }
    ctx.beginPath();
    const { x, y } = entity.position;
    ctx.arc(x, y, entity.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    switch (entity.type) {
        case "cow":
        case "sheep":
            ctx.fillStyle = "#aaa";
            ctx.fillRect(x - 12, y - entity.radius * 0.5, 4, -15);
            ctx.fillRect(x + 8, y - entity.radius * 0.5, 4, -15);
            break;
        case "pig":
            ctx.fillStyle = "#a55";
            ctx.beginPath();
            ctx.arc(x - 7, y, 4, 0, Math.PI * 2);
            ctx.arc(x + 7, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            break;
    }
}

function drawHighlighted(ctx: CanvasRenderingContext2D, highlightedBot: BotInstance) {
    const { name, position: { x, y } } = highlightedBot;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.strokeText(name, x, y - botRadius);
    ctx.fillText(name, x, y - botRadius);
    ctx.font = "15px Arial";
    let drawY = y - botRadius - 22;
    for (const [ type, count ] of highlightedBot.inventory) {
        const text = `${type} x${count}`;
        ctx.strokeText(text, x, drawY);
        ctx.fillText(text, x, drawY);
        drawY -= 17;
    }
}

function drawGizmos(ctx: CanvasRenderingContext2D) {
    for (const gizmo of gizmos) {
        ctx.fillStyle = gizmo.color;
        ctx.strokeStyle = gizmo.color;
        const { x, y } = gizmo.position;
        switch (gizmo.type) {
            case "point":
                ctx.beginPath();
                ctx.arc(x, y, gizmo.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
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
                ctx.closePath();
                break;
        }
    }
}
