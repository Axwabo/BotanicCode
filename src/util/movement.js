import { tileSize, worldToTile } from "./tileConstants.js";

/**
 * @param board {Board}
 * @param from {WorldPosition}
 * @param deltaX {number}
 * @param deltaY {number}
 */
export function validateMove(board, from, deltaX, deltaY) {
    const fromX = from.x;
    const fromY = from.y;
    const toX = from.x + deltaX;
    const toY = from.y + deltaY;
    let lastValidX = fromX;
    let lastValidY = fromY;
    const right = toX > fromX ? tileSize : -tileSize;
    const down = toY > fromY ? tileSize : -tileSize;
    for (let x = fromX + right; toX > fromX ? x < toX : x > toX; x += right)
        for (let y = fromY + down; down ? y < toY : y > toY; y += down) {
            const tile = tileAt(board, x, y);
            if (tile.data?.type === "fence")
                return { x: lastValidX, y: lastValidY, valid: false };
            lastValidX = x;
            lastValidY = y;
        }
    const tile = tileAt(board, toX, toY);
    if (tile.data?.type !== "fence")
        return { x: toX, y: toY, valid: true };
    return { x: lastValidX - Math.sign(deltaX), y: lastValidY - Math.sign(deltaY), valid: false };
}

/**
 * @param board {Board}
 * @param worldX {number}
 * @param worldY {number}
 */
function tileAt(board, worldX, worldY) {
    return board.getTile(Math.floor(worldToTile(worldX)), Math.floor(worldToTile(worldY)));
}
