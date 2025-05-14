import getContext from "./ctx.ts";
import { chunkSize } from "./board.ts";

export function render() {
    const { ctx, width, height, game } = getContext();
    ctx.clearRect(0, 0, width, height);
    ctx.resetTransform();
    ctx.translate(-game.position.x, -game.position.y);
    for (const chunk of game.board.chunks) {
        ctx.save();
        ctx.translate(chunk.x * chunkSize, chunk.y * chunkSize);
        for (const row of chunk.rows) {
            for (let x = 0; x < row.tiles.length; x++) {
                const tile = row.tiles[x];
                ctx.fillStyle = tile.type === "dirt" ? "brown" : "green"; // TODO: images
                ctx.fillRect(x * chunkSize, row.chunkY * chunkSize, chunkSize, chunkSize);
            }
        }
        ctx.restore();
    }
}
