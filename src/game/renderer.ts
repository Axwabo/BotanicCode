import getContext from "./ctx.ts";
import { chunkSize } from "./tileConstants.ts";

export function render() {
    const { ctx, width, height, game } = getContext();
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(-game.position.x, -game.position.y);
    for (const chunk of game.board.chunks) {
        for (const row of chunk.rows)
            for (const tile of row.tiles) {
                if (tile.type === "air")
                    continue;
                ctx.fillStyle = tile.type === "dirt" ? "brown" : "green"; // TODO: images
                ctx.fillRect(tile.worldX * chunkSize, row.worldY * chunkSize, chunkSize, chunkSize);
            }
    }
}
