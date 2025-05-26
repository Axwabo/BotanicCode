import { raycastTile } from "./raycast.js";

/**
 * @param board {Board}
 * @param from {WorldPosition}
 * @param deltaX {number}
 * @param deltaY {number}
 * @param radius {number}
 */
export function validateMove(board, from, deltaX, deltaY, radius) {
    const toX = from.x + deltaX;
    const toY = from.y + deltaY;
    const angle = Math.atan2(deltaY, deltaX);
    const maxDistanceSquared = deltaX * deltaX + deltaY * deltaY;
    const result = raycastTile(board, from.x, from.y, angle, maxDistanceSquared, radius);
    if (!result)
        return { x: toX, y: toY, valid: true };
    const { x, y } = result.hitPoint;
    return { x: x - Math.cos(angle) * radius, y: y - Math.sin(angle) * radius, valid: false };
}
