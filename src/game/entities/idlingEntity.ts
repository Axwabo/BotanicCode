import MovableEntity from "./movableEntity.ts";
import type { EntityType } from "../../bot/sdk/entities";
import ManagedBoard from "../managedBoard.ts";
import type { WorldPosition } from "../../util/tile";
import IdleMovement from "./idleMovement.ts";
import { type Behavior, BehaviorRunner } from "./behavior.ts";
import type { DroppedItem, ItemType } from "../../bot/sdk/items";
import { isInRange } from "../../util/distance";
import { tileSize } from "../../util/tileConstants";

export default abstract class IdlingEntity extends MovableEntity {
    radius: number;
    readonly type: EntityType;
    private readonly behaviorRunner: BehaviorRunner;
    protected readonly movement: IdleMovement;
    protected abstract readonly edibleItems: ItemType[];

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
        while (true) {
            if (this.energy <= 0.8)
                yield* this.eatNearbyItem();
            yield* this.movement.moveIldlyOnce();
        }
    }

    protected* eatNearbyItem() {
        const item = this.findEdibleItem();
        if (!item || this.energy > 0.8)
            return false;
        this.movement.target = item.position;
        yield* this.movement.goToTarget();
        yield Math.random() + 1;
        let any = false;
        while (item.amount && this.energy <= 0.8) {
            any = true;
            item.amount--;
            this.board.handleItemUpdate(item);
            this.depleteEnergy(-0.05);
            yield Math.random() * 2 + 1;
        }
        return any;
    }

    private findEdibleItem(): DroppedItem | undefined {
        for (const value of Object.values(this.board.getChunkAtPosition(this.position).items)) {
            const item = <DroppedItem>value;
            if (this.edibleItems.includes(item.type)
                && isInRange(item.position.x, item.position.y, this.position.x, this.position.y, 10 * tileSize))
                return item;
        }
    }

}
