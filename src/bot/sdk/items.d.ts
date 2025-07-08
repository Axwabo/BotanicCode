import type { PlantType } from "../../util/tile";

export type Plantable = "wheatSeed" | "tomatoSeed" | "strawberrySeed" | "potato" | "carrot";

export type ItemType = PlantType | Plantable;

export type Inventory = Map<ItemType, number>;
