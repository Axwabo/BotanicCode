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
    const y = sx - ey;
    return x * x + y * y;
}
