import { tileSize, tilesPerChunk, worldToChunk } from "../../util/tileConstants";
import type { Tile } from "../../util/tile";
import { getBoundingBoxes } from "../../util/world/boundingBoxes";
import { fillCircle, lightning } from "./shapes.ts";
import type { GameState } from "../gameState.ts";

export function viewportChunks(x: number, y: number, width: number, height: number, zoom: number) {
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

export function drawViewportChunks(ctx: CanvasRenderingContext2D, game: GameState, startX: number, endX: number, startY: number, endY: number) {
    for (let x = startX; x <= endX; x++)
        for (let y = startY; y <= endY; y++) {
            const chunk = game.board.getChunk(x, y);
            for (const row of chunk.rows)
                for (const tile of row.tiles)
                    drawTile(ctx, tile);
            if (game.loadedChunks.has(chunk))
                continue;
            ctx.fillStyle = "rgba(120, 120, 120, 0.3)";
            ctx.fillRect(chunk.x * tilesPerChunk * tileSize, chunk.y * tilesPerChunk * tileSize, tilesPerChunk * tileSize, tilesPerChunk * tileSize);
        }
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
        case "chargingStation":
            ctx.fillStyle = "#89d6ff";
            fillCircle(ctx, x + tileSize * 0.5, y + tileSize * 0.5, tileSize * 0.3);
            lightning(ctx, x + tileSize * 0.5, y + tileSize * 0.5);
            break;
        case "wheat":
            ctx.fillStyle = `hsl(${120 - 60 * data.growthPercentage}, 50%, 50%)`;
            for (let i = 2; i < tileSize; i += 4)
                ctx.fillRect(x + i, y + tileSize - 2, 3, -tileSize * 0.5);
            break;
        case "carrot":
            ctx.fillStyle = "#f50";
            ctx.beginPath();
            ctx.moveTo(x + tileSize * 0.5, y + tileSize * 0.9);
            ctx.lineTo(x + tileSize * (0.5 - (data.growthPercentage + 0.1) * 0.2), y + tileSize * (0.9 - (data.growthPercentage + 0.1) * 0.5));
            ctx.lineTo(x + tileSize * (0.5 + (data.growthPercentage + 0.1) * 0.2), y + tileSize * (0.9 - (data.growthPercentage + 0.1) * 0.5));
            ctx.fill();
            break;
        case "potato":
            ctx.fillStyle = "#a17d42";
            ctx.beginPath();
            ctx.ellipse(
                x + tileSize * 0.5,
                y + tileSize * 0.7,
                (data.growthPercentage * 0.2 + 0.05) * tileSize,
                (data.growthPercentage * 0.1 + 0.05) * tileSize,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
            break;
        case "tomato":
            ctx.fillStyle = "#ff2f00";
            fillCircle(ctx, x + tileSize * 0.5, y + tileSize * 0.7, (data.growthPercentage * 0.1 + 0.1) * tileSize);
            break;
        case "strawberry":
            ctx.fillStyle = "#bd0a39";
            ctx.beginPath();
            ctx.moveTo(x + tileSize * 0.5, y + tileSize * 0.8);
            ctx.lineTo(x + tileSize * (0.5 - (data.growthPercentage + 0.1) * 0.2), y + tileSize * (0.8 - (data.growthPercentage + 0.1) * 0.15));
            ctx.lineTo(x + tileSize * (0.5 + (data.growthPercentage + 0.1) * 0.2), y + tileSize * (0.8 - (data.growthPercentage + 0.1) * 0.15));
            ctx.fill();
            break;
    }
}
