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
    const right = toX > fromX;
    const down = toY > fromY;
    let lastValidX = fromX;
    let lastValidY = fromY;
    for (let x = from.x; right ? x < toX : x > toX; x += right ? tileSize : -tileSize)
        for (let y = fromY; down ? y < toY : y > toY; y += down ? tileSize : -tileSize) {
            const tile = tileAt(board, x, y);
            if (tile.data?.type === "fence")
                return { x: lastValidX, y: lastValidY, valid: false };
            lastValidX = x;
            lastValidY = y;
        }
    const tile = tileAt(board, toX, toY);
    if (tile.data?.type === "fence")
        return { x: lastValidX, y: lastValidY, valid: false };
    // TODO: clamp
    return { x: toX, y: toY, valid: true };
}

/**
 * @param board {Board}
 * @param worldX {number}
 * @param worldY {number}
 */
function tileAt(board, worldX, worldY) {
    return board.getTile(Math.floor(worldToTile(worldX)), Math.floor(worldToTile(worldY)));
}
