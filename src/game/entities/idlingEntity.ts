import MovableEntity from "./movableEntity.ts";
import type { EntityType } from "../../bot/sdk/entities";
import ManagedBoard from "../managedBoard.ts";
import type { WorldPosition } from "../../util/tile";
import IdleMovement from "./idleMovement.ts";
import { type Behavior, BehaviorRunner } from "./behavior.ts";
import type { DroppedItem, ItemType } from "../../bot/sdk/items";
import { isInRange } from "../../util/distance";
import { tileSize } from "../../util/tileConstants";
import { nearbyChunkOffsets } from "../tick.ts";
import type { Chunk } from "../../util/world/tile";

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
            yield* this.eatNearbyItem();
            yield* this.movement.moveIldlyOnce();
        }
    }

    get wantsToEat() {
        return this.energy <= 0.8;
    }

    protected* eatNearbyItem() {
        if (!this.wantsToEat)
            return false;
        const item = this.findEdibleItem();
        if (!item)
            return false;
        this.movement.target = item.position;
        yield* this.movement.goToTarget();
        yield Math.random() + 1;
        let any = false;
        while (item.amount && this.wantsToEat) {
            any = true;
            item.amount--;
            this.board.handleItemUpdate(item);
            this.depleteEnergy(-0.05);
            yield Math.random() * 2 + 1;
        }
        return any;
    }

    private findEdibleItem(): DroppedItem | undefined {
        const currentChunk = this.board.getChunkAtPosition(this.position);
        const chunks: Chunk[] = [
            currentChunk,
            ...nearbyChunkOffsets.map(([ x, y ]) => this.board.getChunk(currentChunk.x + x, currentChunk.y + y))
        ];
        for (const chunk of chunks)
            for (const value of Object.values(chunk.items)) {
                const item = <DroppedItem>value;
                if (this.edibleItems.includes(item.type)
                    && isInRange(item.position.x, item.position.y, this.position.x, this.position.y, 10 * tileSize))
                    return item;
            }
    }

}
