import { raycastTile } from "./raycast.js";
import { tileSize } from "./tileConstants.js";

const padding = tileSize * 0.5;

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
    const maxDistanceSquared = deltaX * deltaX + deltaY * deltaY;
    const result = raycastTile(board, from.x, from.y, angle, maxDistanceSquared, padding);
    if (!result)
        return { x: toX, y: toY, valid: true };
    const { x, y } = result.hitPoint;
    return { x: x - Math.cos(angle) * padding, y: y - Math.sin(angle) * padding, valid: false };
}
