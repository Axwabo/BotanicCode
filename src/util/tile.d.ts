import type { Chunk } from "./world/tile.js";

export interface WorldPosition {
    x: number;
    y: number;
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

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
