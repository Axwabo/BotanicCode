export type TileType = "grass" | "dirt";

export interface Tile {
    worldX: number;
    worldY: number;
    type: TileType;
}

export interface Row {
    chunkY: number;
    tiles: Tile[];
}
