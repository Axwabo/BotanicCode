import { tileSize } from "./tileConstants.js";

/**
 * @param board {Board}
 * @param x {number}
 * @param y {number}
 * @param angle {number} Direction in radians.
 * @param maxDistanceSquared {number}
 * @return {RaycastResult | undefined}
 */
export function raycastTile(board, x, y, angle, maxDistanceSquared) {
    const deltaX = Math.cos(angle) * tileSize;
    const deltaY = Math.sin(angle) * tileSize;
    let currentDistanceSquared = 0;
    while (currentDistanceSquared <= maxDistanceSquared) {
        const tile = board.getTileAt(x, y);
        if (tile.data)
            return { hitPoint: { x, y }, tile }; // TODO: actual raycast
        currentDistanceSquared += tileSize;
        x += deltaX;
        y += deltaY;
    }
    return undefined;
}
