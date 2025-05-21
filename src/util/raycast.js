import { tileSize } from "./tileConstants.js";
import { getBoundingBoxes } from "./world/boundingBoxes.js";

/**
 * @param board {Board}
 * @param x {number}
 * @param y {number}
 * @param angle {number} Direction in radians.
 * @param maxDistanceSquared {number}
 * @param padding {number}
 * @return {RaycastResult | undefined}
 */
export function raycastTile(board, x, y, angle, maxDistanceSquared, padding = 0) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const deltaX = cos * tileSize;
    const deltaY = sin * tileSize;
    let offsetX = cos * padding;
    let offsetY = sin * padding;
    let currentDistanceSquared = 0;
    while (currentDistanceSquared < maxDistanceSquared) {
        const tile = board.getTileAt(x + offsetX, y + offsetY);
        if (tile.data)
            return intersectTile(x, y, offsetX, offsetY, tile);
        offsetX += deltaX;
        offsetY += deltaY;
        currentDistanceSquared = offsetX * offsetX + offsetY * offsetY;
    }
    const tile = board.getTileAt(x + offsetX, y + offsetY);
    if (!tile.data)
        return undefined;
    const result = intersectTile(x, y, offsetX, offsetY, tile);
    return result && result.distanceSquared <= maxDistanceSquared ? result : undefined;
}

/**
 * @param x {number}
 * @param y {number}
 * @param deltaX {number}
 * @param deltaY {number}
 * @param tile {Tile}
 * @return {RaycastResult | undefined}
 */
function intersectTile(x, y, deltaX, deltaY, tile) {
    const boxes = getBoundingBoxes(tile.data);
    const tileX = tile.x * tileSize;
    const tileY = tile.y * tileSize;
    /** @type {LineIntersectResult[]} */
    const results = new Array(boxes.length * 4);
    for (const box of boxes) {
        const topLeftX = tileX + box.x;
        const topLeftY = tileY + box.y;
        const bottomLeftX = topLeftX;
        const bottomLeftY = topLeftY + box.height;
        const topRightX = topLeftX + box.width;
        const topRightY = topLeftY;
        const bottomRightX = topLeftX + box.width;
        const bottomRightY = topLeftY + box.height;
        results.push(intersect(x, y, x + deltaY, y + deltaY, topLeftX, topLeftY, topRightX, topRightY));
        results.push(intersect(x, y, x + deltaX, y + deltaY, topLeftX, topLeftY, bottomLeftX, bottomLeftY));
        results.push(intersect(x, y, x + deltaX, y + deltaY, topRightX, topRightY, bottomRightX, bottomRightY));
        results.push(intersect(x, y, x + deltaY, y + deltaY, bottomLeftX, bottomLeftY, bottomRightX, bottomRightY));
    }
    let minDistanceSquared = Number.MAX_SAFE_INTEGER;
    /** @type {LineIntersectResult} */
    let hitPoint = false;
    for (const result of results) {
        if (!result)
            continue;
        const a = x - result.x;
        const b = y - result.y;
        const distanceSquared = a * a + b * b;
        if (distanceSquared >= minDistanceSquared)
            continue;
        minDistanceSquared = distanceSquared;
        hitPoint = result;
    }
    return hitPoint ? { hitPoint, tile, distanceSquared: minDistanceSquared } : undefined;
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if (x1 === x2 && y1 === y2 || x3 === x4 && y3 === y4) {
        return false;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return an object with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);

    return { x, y };
}
