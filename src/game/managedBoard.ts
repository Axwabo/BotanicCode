import { Board } from "../util/world/board";
import type { Entity } from "../bot/sdk/entities";

export default class ManagedBoard extends Board {
    readonly entities: Set<Entity> = new Set<Entity>();
}
