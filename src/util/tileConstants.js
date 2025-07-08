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

/** @param tile {Tile} */
export function worldCenter(tile) {
    return { x: tile.x * tileSize + tileSize * 0.5, y: tile.y * tileSize + tileSize * 0.5 };
}
