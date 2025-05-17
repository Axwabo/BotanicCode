export type BotRequest = Create | Move | Terminate;
export type BotResponse = PositionUpdate;

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

interface PositionUpdate {
    type: "position";
    x: number;
    y: number;
}
