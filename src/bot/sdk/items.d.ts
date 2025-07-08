import type { PlantType, WorldPosition } from "../../util/tile";

export type Plantable = "wheatSeed" | "tomatoSeed" | "strawberrySeed" | "potato" | "carrot";

export type ItemType = PlantType | Plantable;

export type Inventory = Map<ItemType, number>;

export interface DroppedItem {
    readonly id: string;
    type: ItemType;
    amount: number;
    position: WorldPosition;
}
