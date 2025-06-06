import MovableEntity from "./movableEntity.ts";
import type { WorldPosition } from "../../util/tile";
import { distanceSquared, normalize } from "../../util/distance";
import { tileSize } from "../../util/tileConstants";

function randomOffset() {
    return Math.round((Math.random() * 6 - 3) * tileSize);
}

export default class IdleMovement<T extends MovableEntity<T>> {
    private readonly entity: T;
    private readonly movementSpeed: number;

    target?: WorldPosition;
    waitTime: number = 0;

    constructor(entity: T, movementSpeed: number) {
        this.entity = entity;
        this.movementSpeed = movementSpeed;
    }

    tick(deltaSeconds: number) {
        if (this.target) {
            const { x, y } = normalize(this.target.x - this.position.x, this.target.y - this.position.y);
            if (!this.entity.move(x * this.movementSpeed * deltaSeconds, y * this.movementSpeed * deltaSeconds)) {
                this.target = undefined;
                return;
            }
            if (distanceSquared(this.target.x, this.target.y, this.position.x, this.position.y) > 0.1)
                return;
            this.entity.move(this.target.x - this.position.x, this.target.y - this.position.y);
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
        return this.entity.position;
    }
}
