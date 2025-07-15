import type { BotRequest, BotResponse } from "../bot/sdk/requests";
import type { Tile, WorldPosition } from "./tile";
import type { Gizmo } from "./gizmos";
import type { Entity } from "../bot/sdk/entities";
import type { DroppedItem, ItemType } from "../bot/sdk/items";

export type WorkerMessage = Ready | BotRequestMessage | DrawGizmos | ClearGizmos | Log;
export type GameMessage = Render | BotResponseMessage | World | TileUpdate | EntityAdd | EntityPositionUpdate | EntityEnergyUpdate | EntityRemove | ItemUpdate;

export type LogType = "debug" | "info" | "warn" | "error" | "fatal";

interface Ready {
    type: "ready";
}

interface DrawGizmos {
    type: "drawGizmos";
    gizmos: Gizmo[]
}

interface ClearGizmos {
    type: "clearGizmos";
}

interface BotRequestMessage {
    type: "bot";
    name: string;
    request: BotRequest;
}

interface Log {
    type: "log";
    content: any;
    logType: LogType;
}

interface Render {
    type: "render";
    delta: number;
}

export interface InitialBotData {
    name: string;
    position: WorldPosition;
    inventory: [ ItemType, number ][];
    energy: number;
    magicReady: boolean;
}

interface World {
    type: "world";
    board: string;
    bots: InitialBotData[];
}

interface TileUpdate {
    type: "tile"
    tile: Tile
}

interface BotResponseMessage {
    type: "bot";
    name: string;
    response: BotResponse;
}

interface EntityAdd {
    type: "entityAdd";
    entity: Entity;
}

interface EntityPositionUpdate {
    type: "entityPositionUpdate";
    id: string;
    position: WorldPosition;
}

interface EntityEnergyUpdate {
    type: "entityEnergyUpdate";
    id: string;
    energy: number;
}

interface EntityRemove {
    type: "entityRemove";
    id: string;
}

interface ItemUpdate {
    type: "itemUpdate";
    item: DroppedItem;
}
