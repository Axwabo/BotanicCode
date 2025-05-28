import MovableEntity from "./movableEntity.ts";
import { tileSize } from "../../util/tileConstants";
import IdleMovement from "./idleMovement.ts";

const radius = tileSize * 0.6;

const movementSpeed = tileSize * 0.5;

export default class Pig extends MovableEntity<Pig> {
    readonly type = "pig";
    readonly radius = radius;
    private readonly movement = new IdleMovement(this, movementSpeed);

    tick(deltaSeconds: number) {
        super.tick(deltaSeconds);
        this.movement.tick(deltaSeconds);
    }
}
