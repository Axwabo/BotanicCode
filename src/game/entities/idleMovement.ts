import MovableEntity from "./movableEntity.ts";
import type { WorldPosition } from "../../util/tile";
import { distanceSquared, normalize } from "../../util/distance";
import { tileSize } from "../../util/tileConstants";
import { type Behavior, nextFrame } from "./behavior.ts";

function randomOffset() {
    return Math.round((Math.random() * 6 - 3) * tileSize);
}

export default class IdleMovement {
    private readonly entity: MovableEntity;
    private readonly movementSpeed: number;

    target?: WorldPosition;
    waitTime: number = 0;

    constructor(entity: MovableEntity, movementSpeed: number) {
        this.entity = entity;
        this.movementSpeed = movementSpeed;
    }

    * goToTarget(): Behavior {
        while (this.target) {
            const { x, y } = normalize(this.target.x - this.position.x, this.target.y - this.position.y);
            const deltaSeconds = yield nextFrame;
            if (!this.entity.move(x * this.movementSpeed * deltaSeconds, y * this.movementSpeed * deltaSeconds)) {
                this.target = undefined;
                break;
            }
            if (distanceSquared(this.target.x, this.target.y, this.position.x, this.position.y) > 0.1)
                continue;
            this.entity.move(this.target.x - this.position.x, this.target.y - this.position.y);
            this.target = undefined;
        }
    }

    randomizeTarget() {
        this.waitTime = Math.random() * 10 + 5;
        const { x, y } = this.position;
        this.target = { x: x + randomOffset(), y: y + randomOffset() };
    }

    * moveIldlyOnce(): Behavior {
        this.randomizeTarget();
        yield* this.goToTarget();
        yield this.waitTime;
    }

    private get position() {
        return this.entity.position;
    }

}
