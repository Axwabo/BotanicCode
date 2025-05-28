import type { WorldPosition } from "../../util/tile";

export type EntityType = "cow" | "pig";

export interface Updatable {
    tick(deltaSeconds: number): void;
}

export interface Entity {
    readonly id: string;
    type: EntityType;
    position: WorldPosition;
    radius: number;
}
