import { Board } from "../util/world/board";
import type { ManagedEntity } from "./entities/interfaces.ts";

export default class ManagedBoard extends Board {
    readonly entities: Set<ManagedEntity> = new Set<ManagedEntity>();
}
