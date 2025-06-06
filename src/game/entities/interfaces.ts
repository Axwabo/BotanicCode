import type { Entity, Updatable } from "../../bot/sdk/entities";

export interface ManagedEntity extends Entity, Updatable {
    get secondsLived(): number;

    remove(): void;
}
