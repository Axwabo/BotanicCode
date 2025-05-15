export const chunkSize = 32;
export const tileSize = 30;

/** @param coord {number} */
export function worldToChunk(coord) {
    return coord / tileSize / chunkSize;
}

/** @param coord {number} */
export function getChunkRemainder(coord) {
    return coord >= 0 ? coord % chunkSize : chunkSize - Math.abs(coord) % chunkSize;
}
