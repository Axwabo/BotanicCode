import type { WorldPosition } from "../../util/tile";
import { validateMove } from "../../util/movement";
import type { EntityType } from "../../bot/sdk/entities";
import ManagedBoard from "../managedBoard.ts";
import type { ManagedEntity } from "./interfaces.ts";
import EntityAddedEvent from "../../util/world/events/entityAdded";
import EntityPositionUpdatedEvent from "../../util/world/events/entityPosition";
import EntityRemovedEvent from "../../util/world/events/entityRemoved";
import EntityHungerUpdatedEvent from "../../util/world/events/entityHungerUpdated";

export default abstract class MovableEntity<T extends MovableEntity<T>> implements ManagedEntity {
    readonly id: string = crypto.randomUUID();
    readonly board: ManagedBoard;
    position: WorldPosition;
    abstract readonly type: EntityType;
    abstract radius: number;
    private lifetime: number = 0;
    hunger: number = 0;

    protected constructor(board: ManagedBoard, position: WorldPosition) {
        this.board = board;
        this.position = position;
        this.board.entities.add(this);
        this.board.dispatchEvent(new EntityAddedEvent(this));
    }

    move(deltaX: number, deltaY: number): boolean {
        const { x, y, valid } = validateMove(this.board, this.position, deltaX, deltaY, this.radius);
        this.position.x = x;
        this.position.y = y;
        this.board.dispatchEvent(new EntityPositionUpdatedEvent(this.id, this.position));
        return valid;
    }

    tick(deltaSeconds: number): void {
        this.lifetime += deltaSeconds;
        this.increaseHunger(deltaSeconds * 0.001);
        if (this.hunger === 1)
            this.remove();
    }

    get secondsLived() {
        return this.lifetime;
    }

    remove() {
        this.board.entities.delete(this);
        this.board.dispatchEvent(new EntityRemovedEvent(this.id));
    }

    increaseHunger(delta: number) {
        this.hunger = Math.max(0, Math.min(1, this.hunger + delta));
        this.board.dispatchEvent(new EntityHungerUpdatedEvent(this.id, this.hunger));
    }
}
