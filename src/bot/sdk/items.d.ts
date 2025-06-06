import type { PlantType } from "../../util/tile";

export type ItemType = PlantType;

export type Inventory = Map<ItemType, number>;
