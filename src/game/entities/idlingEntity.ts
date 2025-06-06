import MovableEntity from "./movableEntity.ts";
import type { EntityType } from "../../bot/sdk/entities";
import ManagedBoard from "../managedBoard.ts";
import type { WorldPosition } from "../../util/tile";
import IdleMovement from "./idleMovement.ts";

export default class IdlingEntity extends MovableEntity<IdlingEntity> {
    radius: number;
    readonly type: EntityType;
    private readonly movement: IdleMovement<IdlingEntity>;

    constructor(board: ManagedBoard, position: WorldPosition, type: EntityType, radius: number, speed: number) {
        super(board, position);
        this.radius = radius;
        this.type = type;
        this.movement = new IdleMovement(this, speed);
    }

    tick(deltaSeconds: number) {
        super.tick(deltaSeconds);
        this.movement.tick(deltaSeconds);
    }
}
