import getContext from "./ctx.ts";
import { tileSize, worldToChunk } from "./tileConstants.ts";

export function render() {
    const { ctx, width, height, game } = getContext();
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(Math.floor(width * 0.5), Math.floor(height * 0.5));
    const { x, y } = game.position;
    ctx.translate(-x, -y);
    const { startX, startY, endX, endY } = viewportChunks(x, y, width, height);
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            const chunk = game.board.getChunk(x, y);
            for (const row of chunk.rows)
                for (const tile of row.tiles) {
                    if (tile.type === "air")
                        continue;
                    ctx.fillStyle = tile.type === "dirt"
                        ? "brown"
                        : tile.type === "gravel"
                            ? "gray"
                            : "green"; // TODO: images
                    ctx.fillRect(tile.worldX * tileSize, tile.worldY * tileSize, tileSize, tileSize);
                }
        }
    }
    ctx.resetTransform();
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
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
