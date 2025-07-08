import { isInRange } from "../distance.js";

/**
 * @param board {Board}
 * @param startX {number}
 * @param startY {number}
 * @param endX {number}
 * @param endY {number}
 * @param match {(tile: Tile) => boolean}
 * @returns {Tile | undefined}
 */
export function findTileBox(board, startX, startY, endX, endY, match) {
    const addX = Math.sign(endX - startX);
    const addY = Math.sign(endY - startY);
    for (let x = startX; x <= endX; x += addX)
        for (let y = startY; y <= endY; y += addY) {
            const tile = board.getTile(x, y);
            if (tile && match(tile))
                return tile;
        }
}

/**
 * @param board {Board}
 * @param startX {number}
 * @param startY {number}
 * @param radius {number}
 * @param match {(tile: Tile) => boolean}
 * @return {Tile | undefined}
 */
export function findTileCircle(board, startX, startY, radius, match) {
    const startTile = board.getTile(startX, startY);
    if (startTile && match(startTile))
        return startTile;
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            if (!isInRange(startX, startY, x, y, radius))
                continue;
            const tile = board.getTile(startX + x, startY + y);
            if (tile && match(tile))
                return tile;
        }
    }
}
