import type { ItemType } from "./items";

export type BotRequest = Create | Move | Terminate | Harvest;
export type BotResponse = Terminate | PositionUpdate | PickUp;

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
