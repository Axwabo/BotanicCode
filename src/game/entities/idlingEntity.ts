import MovableEntity from "./movableEntity.ts";
import type { EntityType } from "../../bot/sdk/entities";
import ManagedBoard from "../managedBoard.ts";
import type { WorldPosition } from "../../util/tile";
import IdleMovement from "./idleMovement.ts";
import { type Behavior, BehaviorRunner } from "./behavior.ts";

export default class IdlingEntity extends MovableEntity {
    radius: number;
    readonly type: EntityType;
    private readonly behaviorRunner: BehaviorRunner;
    protected readonly movement: IdleMovement;

    constructor(board: ManagedBoard, position: WorldPosition, type: EntityType, radius: number, speed: number) {
        super(board, position);
        this.radius = radius;
        this.type = type;
        this.movement = new IdleMovement(this, speed);
        this.behaviorRunner = new BehaviorRunner(this.behavior());
    }

    tick(deltaSeconds: number) {
        super.tick(deltaSeconds);
        this.behaviorRunner.tick(deltaSeconds);
    }

    protected* behavior(): Behavior {
    }
}
