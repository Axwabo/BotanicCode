import type { Tile, WorldPosition } from "./tile";

export interface RaycastResult {
    hitPoint: WorldPosition;
    distanceSquared: number;
    tile: Tile;
}

export type LineIntersectResult = WorldPosition | false;
