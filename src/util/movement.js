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

// what I learned in math class:
// need:
// - normals of lines e and f (A, B)
// - point on lines defined by (x0, y0)
// line = Ax + By = A * x0 + B * y0

// e = Ae * x + Be * y = Ae * x0e + Be * y0e
// f = Af * x + Bf * y = Af * x0f + Bf * y0f

// x = (Ae * x0e + Be * y0e - Be * y) / Ae

// Af * ((Ae * x0e + Be * y0e - Be * y) / Ae) + Bf * y = Af * x0f + Bf * y0f
// y = (Af * x0f + Bf * y0f) / (Af * ((Ae * x0e + Be * y0e - Be * y) / Ae) + Bf)
