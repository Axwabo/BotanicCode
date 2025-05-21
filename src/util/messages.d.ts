import type { BotRequest, BotResponse } from "../bot/sdk/requests";
import type { Tile } from "./tile";
import type { Gizmo } from "./gizmos";

export type WorkerMessage = Ready | BotRequestMessage | DrawGizmos | ClearGizmos | Error;
export type GameMessage = Render | BotResponseMessage | World | TileUpdate;

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
