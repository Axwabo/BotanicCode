import type { Chunk } from "./world/tile.js";
import type { Updatable } from "../bot/sdk/entities";

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

export type TileData = Fence | Wheat | Carrot;

export interface Fence {
    type: "fence";
    posts: Facing[];
}

export interface GrowingPlant extends Updatable {
    ageSeconds: number;

    get growthPercentage(): number;
}

export interface Wheat extends GrowingPlant {
    type: "wheat";
}

export interface Carrot extends GrowingPlant {
    type: "carrot";
}

interface ChunkRow {
    positive: Chunk[];
    negative: Chunk[];
}
