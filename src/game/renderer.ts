import getContext, { canvasToWorld } from "./ctx.ts";
import { tileSize, worldToChunk } from "./tileConstants.ts";
import type { Tile } from "./tile.ts";
import type { Facing } from "./tileData.ts";

export function render() {
    const { ctx, width, height, game, pointerX, pointerY } = getContext();
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(Math.floor(width * 0.5), Math.floor(height * 0.5));
    const { x, y } = game.position;
    ctx.translate(-x, -y);
    const { startX, startY, endX, endY } = viewportChunks(x, y, width, height);
    for (let x = startX; x <= endX; x++)
        for (let y = startY; y <= endY; y++)
            for (const row of game.board.getChunk(x, y).rows)
                for (const tile of row.tiles)
                    drawTile(ctx, tile);
    ctx.font = "20px monospace";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    for (const [ name, bot ] of game.bots) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(bot.position.x, bot.position.y, tileSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillText(name, bot.position.x, bot.position.y - tileSize * 0.5);
    }
    if (!isNaN(pointerX) && !isNaN(pointerY)) {
        const { x: tileX, y: tileY } = canvasToWorld(pointerX, pointerY);
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fillRect(Math.floor(tileX / tileSize) * tileSize, Math.floor(tileY / tileSize) * tileSize, tileSize, tileSize);
    }
    ctx.resetTransform();
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(`X: ${x} (chunk: ${Math.floor(worldToChunk(x))})`, 5, 5);
    ctx.fillText(`Y: ${y} (chunk: ${Math.floor(worldToChunk(y))})`, 5, 25);
}

function viewportChunks(x: number, y: number, width: number, height: number) {
    const chunkX = Math.floor(worldToChunk(x));
    const chunkY = Math.floor(worldToChunk(y));
    const startX = chunkX - Math.ceil(worldToChunk(width * 0.5));
    const startY = chunkY - Math.ceil(worldToChunk(height * 0.5));
    const endX = chunkX + Math.ceil(worldToChunk(width * 0.5));
    const endY = chunkY + Math.ceil(worldToChunk(height * 0.5));
    return { startX, startY, endX, endY };
}

function drawTile(ctx: CanvasRenderingContext2D, tile: Tile) {
    const x = tile.worldX * tileSize;
    const y = tile.worldY * tileSize;
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
            ctx.fillRect(x + tileSize * 0.5 - 3, y + 5, 6, tileSize - 10);
            drawFencePosts(ctx, x, y, data.posts);
            break;
    }
}

function drawFencePosts(ctx: CanvasRenderingContext2D, x: number, y: number, posts: Facing[]) {
    if (posts.includes("north"))
        ctx.fillRect(x + tileSize * 0.5 - 2, y, 4, 5);
    if (posts.includes("south"))
        ctx.fillRect(x + tileSize * 0.5 - 2, y + tileSize, 4, -5);
    if (posts.includes("west"))
        ctx.fillRect(x, y + tileSize * 0.5, tileSize * 0.5, 4);
    if (posts.includes("east"))
        ctx.fillRect(x + tileSize, y + tileSize * 0.5, -tileSize * 0.5, 4);
}
