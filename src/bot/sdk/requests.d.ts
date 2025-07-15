import type { ItemType, Plantable } from "./items";
import type { Entity } from "./entities";
import type { Tile } from "../../util/tile";

export type BotRequest = Create | Move | Terminate | Harvest | Plant | Drop | Magic;
export type BotResponse = Terminate | PositionUpdate | PickUp | EnergyDepletion | MagicReady;

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

interface Harvest {
    type: "harvest";
}

interface Plant {
    type: "plant";
    kind: Plantable;
}

interface Drop {
    type: "drop";
    item: ItemType;
    amount: number;
}

interface Magic {
    type: "magic";
    target: Entity | Tile;
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

interface MagicReady {
    type: "magicReady";
}
