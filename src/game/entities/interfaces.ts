import type { Entity } from "../../bot/sdk/entities";

export interface ManagedEntity extends Entity {
    tick(deltaSeconds: number): void;

    get secondsLived(): number;

    remove(): void;
}
