import type { BotRequest, BotResponse } from "../bot/sdk/requests";
import type { Tile } from "./tile";

export type WorkerMessage = Ready | BotRequestMessage | Error;
export type GameMessage = Render | BotResponseMessage | World | TileUpdate;

interface Ready {
    type: "ready";
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
