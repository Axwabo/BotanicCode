import type { Board } from "./world/board";

export type WorkerMessage = Ready | Move | Error;
export type GameMessage = Render | World;

interface Ready {
    type: "ready";
}

interface Move {
    type: "move";
    x: number;
    y: number;
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
