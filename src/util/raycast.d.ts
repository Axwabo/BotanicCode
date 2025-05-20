import type { Tile, WorldPosition } from "./tile";

export interface RaycastResult {
    hitPoint: WorldPosition;
    tile: Tile;
}
