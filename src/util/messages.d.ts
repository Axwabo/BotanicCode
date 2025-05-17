import type { Board } from "./world/board";
import type { BotRequest, BotResponse } from "../bot/sdk/requests";

export type WorkerMessage = Ready | BotRequestMessage | Error;
export type GameMessage = Render | BotResponseMessage | World;

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
    board: Board;
}

interface BotResponseMessage {
    type: "bot";
    name: string;
    response: BotResponse;
}
