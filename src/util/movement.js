import { raycastTile } from "./raycast.js";
import { tileSize } from "./tileConstants.js";
import sendMessage from "../bot/sdk/message.js";

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
    const result = raycastTile(board, from.x, from.y, angle, deltaX * deltaX + deltaY * deltaY, padding);
    if (!result)
        return { x: toX, y: toY, valid: true };
    sendMessage({ type: "drawGizmo", gizmos: [ { color: "white", type: "point", position: result.hitPoint, radius: 2 } ] });
    const { x, y } = result.hitPoint;
    return { x: x - Math.cos(angle) * padding, y: y - Math.sin(angle) * padding, valid: false };
}
