import type { WorldPosition } from "../../util/tile";

export type EntityType = "cow" | "pig" | "sheep" | "chicken";

export interface Updatable {
    tick(deltaSeconds: number): boolean | void;
}

export interface Entity {
    readonly id: string;
    type: EntityType;
    position: WorldPosition;
    radius: number;
    energy: number;
}
