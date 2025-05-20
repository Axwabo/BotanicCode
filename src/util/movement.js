import { raycastTile } from "./raycast.js";

/**
 * @param board {Board}
 * @param from {WorldPosition}
 * @param deltaX {number}
 * @param deltaY {number}
 */
export function validateMove(board, from, deltaX, deltaY) {
    const toX = from.x + deltaX;
    const toY = from.y + deltaY;
    const angle = Math.atan2(deltaY, deltaX);
    const result = raycastTile(board, from.x, from.y, angle, deltaX * deltaX + deltaY * deltaY);
    if (!result)
        return { x: toX, y: toY, valid: true };
    return { ...result.hitPoint, valid: false };
}
