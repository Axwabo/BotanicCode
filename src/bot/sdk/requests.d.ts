import type { ItemType } from "./items";
import type { PlantType } from "../../util/tile";

export type BotRequest = Create | Move | Terminate | Harvest | Plant;
export type BotResponse = Terminate | PositionUpdate | PickUp | EnergyDepletion;

interface Create {
    type: "create";
}

interface Move {
    type: "move";
    deltaX: number;
    deltaY: number;
}

interface Terminate {
    type: "terminate";
}

export interface Harvest {
    type: "harvest";
}

interface Plant {
    type: "plant";
    kind: PlantType;
}

interface PositionUpdate {
    type: "position";
    x: number;
    y: number;
}

interface PickUp {
    type: "pickUp";
    item: ItemType;
    count: number;
}

interface EnergyDepletion {
    type: "energy";
    amount: number;
}
