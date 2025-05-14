export const chunkSize = 32;
export const tileSize = 30;

export type TileType = "grass" | "dirt" | "air";

export function worldToChunk(coord: number) {
    return coord / tileSize / chunkSize;
}
