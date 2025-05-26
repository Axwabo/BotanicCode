import type { WorldPosition } from "../../util/tile";

export type EntityType = "cow";

export interface Entity {
    readonly id: string;
    type: EntityType;
    position: WorldPosition;
    radius: number;
}

export interface Movable {
    move(deltaX: number, deltaY: number): boolean;
}
