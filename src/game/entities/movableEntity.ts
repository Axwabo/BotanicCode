import type { WorldPosition } from "../../util/tile";
import { validateMove } from "../../util/movement";
import type { EntityType } from "../../bot/sdk/entities";
import ManagedBoard from "../managedBoard.ts";
import type { ManagedEntity } from "./interfaces.ts";

export default abstract class MovableEntity<T extends MovableEntity<T>> implements ManagedEntity {
    readonly id: string = crypto.randomUUID();
    readonly board: ManagedBoard;
    position: WorldPosition;
    abstract readonly type: EntityType;
    abstract radius: number;
    private lifetime: number = 0;

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

    tick(deltaSeconds: number): void {
        this.lifetime += deltaSeconds;
    }

    get secondsLived() {
        return this.lifetime;
    }

    remove() {
        this.board.entities.delete(this);
    }
}
