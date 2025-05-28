import { intersectTile, raycastTile } from "./raycast.js";

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
    const front = raycastTile(board, from.x, from.y, angle, maxDistanceSquared, radius);
    if (front) {
        const { x, y } = front.hitPoint;
        return { x: x - Math.cos(angle) * radius, y: y - Math.sin(angle) * radius, valid: false };
    }
    const sideOffsetX = Math.sin(angle) * radius;
    const sideOffsetY = -Math.cos(angle) * radius;
    const rightTile = board.getTileAt(from.x + sideOffsetX, from.y + sideOffsetY);
    const right = rightTile.data ? intersectTile(from.x + sideOffsetX, from.y + sideOffsetY, deltaX, deltaY, rightTile, maxDistanceSquared) : undefined;
    if (right) {
        const { x, y } = right.hitPoint;
        return { x: x - sideOffsetX, y: y - sideOffsetY, valid: false }; // TODO: fix backtracing
    }
    const leftTile = board.getTileAt(from.x - sideOffsetX, from.y - sideOffsetY);
    const left = leftTile.data ? intersectTile(from.x - sideOffsetX, from.y - sideOffsetY, deltaX, deltaY, leftTile, maxDistanceSquared) : undefined;
    if (left) {
        const { x, y } = left.hitPoint;
        return { x: x + sideOffsetX, y: y + sideOffsetY, valid: false };
    }
    return { x: toX, y: toY, valid: true };
}
