import type { WorldPosition } from "../../util/tile";
import { validateMove } from "../../util/movement";
import type { Entity, EntityType } from "../../bot/sdk/entities";
import type ManagedBoard from "../managedBoard.ts";

export default abstract class MovableEntity<T extends MovableEntity<T>> implements Entity {
    readonly id: string = crypto.randomUUID();
    readonly board: ManagedBoard;
    position: WorldPosition;
    abstract readonly type: EntityType;
    abstract radius: number;

    constructor(board: ManagedBoard, position: WorldPosition) {
        this.board = board;
        this.position = position;
        this.board.entities.add(this);
    }

    move(deltaX: number, deltaY: number): boolean {
        const { x, y, valid } = validateMove(this.board, this.position, deltaX, deltaY, this.radius);
        this.position.x = x;
        this.position.y = y;
        return valid;
    }

    remove() {
        this.board.entities.delete(this);
    }
}
