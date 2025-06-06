/**
 * @param sx {number}
 * @param sy {number}
 * @param ex {number}
 * @param ey {number}
 * @param maxRange {number}
 * @returns {boolean}
 */
export function isInRange(sx, sy, ex, ey, maxRange) {
    return distanceSquared(sx, sy, ex, ey) < maxRange * maxRange;
}

/**
 * @param sx {number}
 * @param sy {number}
 * @param ex {number}
 * @param ey {number}
 */
export function distanceSquared(sx, sy, ex, ey) {
    const x = sx - ex;
    const y = sy - ey;
    return x * x + y * y;
}

export function normalize(deltaX, deltaY) {
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return { x: deltaX / length, y: deltaY / length };
}
