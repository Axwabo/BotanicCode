export type BotRequest = Move;
export type BotResponse = PositionUpdate;

interface Move {
    type: "move";
    deltaX: number;
    deltaY: number;
}

interface PositionUpdate {
    type: "position";
    x: number;
    y: number;
}
