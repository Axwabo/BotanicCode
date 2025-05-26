import MovableEntity from "./movableEntity.ts";
import { tileSize } from "../../util/tileConstants";
import type { WorldPosition } from "../../util/tile";
import { distanceSquared, normalize } from "../../util/distance";

const radius = tileSize * 0.8;

const movementSpeed = radius;

function randomOffset() {
    return Math.round((Math.random() * 6 - 3) * tileSize);
}

class CowMovement {
    private readonly cow: Cow;

    target?: WorldPosition;
    waitTime: number = 0;

    constructor(cow: Cow) {
        this.cow = cow;
    }

    tick(deltaSeconds: number) {
        if (this.target) {
            const { x, y } = normalize(this.target.x - this.position.x, this.target.y - this.position.y);
            if (!this.cow.move(x * movementSpeed * deltaSeconds, y * movementSpeed * deltaSeconds)
                || distanceSquared(this.target.x, this.target.y, this.position.x, this.position.y) < 0.1)
                this.target = undefined;
            return;
        }
        if ((this.waitTime -= deltaSeconds) > 0)
            return;
        this.waitTime = Math.random() * 10 + 5;
        const { x, y } = this.position;
        this.target = { x: x + randomOffset(), y: y + randomOffset() };
    }

    private get position() {
        return this.cow.position;
    }
}

export default class Cow extends MovableEntity<Cow> {
    readonly type = "cow";
    readonly radius = radius;
    private readonly movement = new CowMovement(this);

    tick(deltaSeconds: number) {
        super.tick(deltaSeconds);
        this.movement.tick(deltaSeconds);
    }
}
