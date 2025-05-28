import type { WorldPosition } from "../util/tile";
import type { Inventory } from "../bot/sdk/items";

export interface BotInstance {
    name: string;
    position: WorldPosition;
    inventory: Inventory;
}
