import { tileSize } from "./tileConstants.js";

/** @type {LineIntersectResult[]} */
const boxResultsNonAlloc = [];

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
    x += cos * padding;
    y += sin * padding;
    let currentDistanceSquared = 0;
    while (currentDistanceSquared < maxDistanceSquared) {
        const tile = board.getTileAt(x, y);
        if (tile.data)
            return intersectTile(x, y, deltaX, deltaY, tile);
        currentDistanceSquared += tileSize;
        x += deltaX;
        y += deltaY;
    }
    // TODO: check remaining part
    return undefined;
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
    const tileX = tile.x * tileSize;
    const tileY = tile.y * tileSize;
    boxResultsNonAlloc[0] = intersect(x, y, x + deltaY, y + deltaY, tileX, tileY, tileX + tileSize, tileY);
    boxResultsNonAlloc[1] = intersect(x, y, x + deltaX, y + deltaX, tileX, tileY, tileX, tileY + tileSize);
    boxResultsNonAlloc[2] = intersect(x, y, x + deltaX, y + deltaY, tileX, tileY + tileSize, tileX + tileSize, tileY + tileSize);
    boxResultsNonAlloc[3] = intersect(x, y, x + deltaY, y + deltaX, tileX + tileSize, tileY, tileX + tileSize, tileY + tileSize);
    let minDistanceSquared = Number.MAX_SAFE_INTEGER;
    /** @type {LineIntersectResult} */
    let hitPoint = false;
    for (const result of boxResultsNonAlloc) {
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
    return { hitPoint, tile, distanceSquared: minDistanceSquared };
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

    // Return a object with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);

    return { x, y };
}
