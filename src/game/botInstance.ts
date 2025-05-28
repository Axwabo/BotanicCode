import type { WorldPosition } from "../util/tile";
import type { Inventory } from "../bot/sdk/items";
import type { Chunk } from "../util/world/tile";

export interface BotInstance {
    name: string;
    position: WorldPosition;
    inventory: Inventory;
    chunkSeconds: Map<Chunk, number>;
}
