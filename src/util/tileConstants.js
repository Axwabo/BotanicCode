export const tilesPerChunk = 32;
export const tileSize = 30;

/** @param coord {number} */
export function worldToTile(coord) {
    return coord / tileSize;
}

/** @param coord {number} */
export function worldToChunk(coord) {
    return coord / tileSize / tilesPerChunk;
}

/** @param tile {number} */
export function getChunkRemainder(tile) {
    return tile >= 0 ? tile % tilesPerChunk : tilesPerChunk - Math.abs(tile) % tilesPerChunk;
}
