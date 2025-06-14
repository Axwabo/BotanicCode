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

export type TileData = Fence | ChargingStation | Wheat | Carrot | Potato | Tomato | Strawberry;

export interface Fence {
    type: "fence";
    posts: Facing[];
}

export interface ChargingStation {
    type: "chargingStation";
}

export type PlantType = Extract<TileData, GrowingPlant>["type"];

export interface GrowingPlant extends Updatable {
    type: PlantType;
    ageSeconds: number;

    get growthPercentage(): number;
}

export interface Wheat extends GrowingPlant {
    type: "wheat";
}

export interface Carrot extends GrowingPlant {
    type: "carrot";
}

export interface Potato extends GrowingPlant {
    type: "potato";
}

export interface Tomato extends GrowingPlant {
    type: "tomato";
}

export interface Strawberry extends GrowingPlant {
    type: "strawberry";
}

interface ChunkRow {
    positive: Chunk[];
    negative: Chunk[];
}
