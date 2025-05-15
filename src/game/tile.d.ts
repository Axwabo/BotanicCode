import type { Chunk } from "../util/world/tile.js";

export type TileType = "grass" | "dirt" | "gravel" | "air";

export interface Tile {
    x: number;
    y: number;
    type: TileType;
    data?: TileData
}

export type Facing = "north" | "east" | "south" | "west";

export type TileData = Fence; // TODO: more tile data types

export interface Fence {
    type: "fence";
    posts: Facing[];
}

interface ChunkRow {
    positive: Chunk[];
    negative: Chunk[];
}
