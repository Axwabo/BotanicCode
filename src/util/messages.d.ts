import type { BotRequest, BotResponse } from "../bot/sdk/requests";
import type { Tile, WorldPosition } from "./tile";
import type { Gizmo } from "./gizmos";
import type { Entity } from "../bot/sdk/entities";

export type WorkerMessage = Ready | BotRequestMessage | DrawGizmos | ClearGizmos | Error;
export type GameMessage = Render | BotResponseMessage | World | TileUpdate | EntityAdd | EntityUpdate | EntityRemove;

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

interface Error {
    type: "error";
    error: any;
}

interface Render {
    type: "render";
}

interface World {
    type: "world";
    board: string;
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

interface EntityUpdate {
    type: "entityUpdate";
    id: string;
    position: WorldPosition;
}

interface EntityRemove {
    type: "entityRemove";
    id: string;
}
