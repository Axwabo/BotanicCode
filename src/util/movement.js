import { raycastTile } from "./raycast.js";
import isWorker from "./environment.js";
import sendMessage from "../bot/sdk/message.js";

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
    if (isWorker) {
        sendMessage({ type: "clearGizmos" });
        sendMessage({
            type: "drawGizmos",
            gizmos: [
                {
                    type: "point",
                    color: "black",
                    position: from,
                    radius: 2
                },
                {
                    type: "point",
                    color: "blue",
                    position: { x: from.x + sideOffsetX, y: from.y + sideOffsetY },
                    radius: 2
                },
                {
                    type: "point",
                    color: "red",
                    position: { x: from.x - sideOffsetX, y: from.y - sideOffsetY },
                    radius: 2
                }
            ]
        });
    }
    const halfRadiusSquared = radius * radius * 0.25;
    const right = raycastTile(board, from.x + sideOffsetX, from.y + sideOffsetY, angle, halfRadiusSquared);
    if (isWorker)
        console.log(right)
    if (right) {
        const { x, y } = right.hitPoint;
        return { x: x - sideOffsetX, y: y - sideOffsetY, valid: false };
    }
    const left = raycastTile(board, from.x - sideOffsetX, from.y - sideOffsetY, angle, halfRadiusSquared);
    if (isWorker)
        console.log(left)
    if (left) {
        const { x, y } = left.hitPoint;
        return { x: x + sideOffsetX, y: y + sideOffsetY, valid: false };
    }
    return { x: toX, y: toY, valid: true };
}
