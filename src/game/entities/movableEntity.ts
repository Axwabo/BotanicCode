import type { WorldPosition } from "../../util/tile";
import type { Board } from "../../util/world/board";
import { validateMove } from "../../util/movement";
import { worldToChunk } from "../../util/tileConstants";
import type { Entity, EntityType, Movable } from "../../bot/sdk/entities";

export default abstract class MovableEntity implements Entity, Movable {
    readonly id: string = crypto.randomUUID();
    readonly board: Board;
    position: WorldPosition;
    abstract readonly type: EntityType;
    abstract radius: number;

    constructor(board: Board, position: WorldPosition) {
        this.board = board;
        this.position = position;
    }

    move(deltaX: number, deltaY: number): boolean {
        const { x, y, valid } = validateMove(this.board, this.position, deltaX, deltaY, this.radius);
        const prevChunkX = Math.floor(worldToChunk(this.position.x));
        const prevChunkY = Math.floor(worldToChunk(this.position.y));
        this.position.x = x;
        this.position.y = y;
        const newChunkX = Math.floor(worldToChunk(this.position.x));
        const newChunkY = Math.floor(worldToChunk(this.position.y));
        if (prevChunkX !== newChunkX || prevChunkY !== newChunkY) {
            this.board.getChunk(prevChunkX, prevChunkY).entities.delete(this);
            this.board.getChunk(newChunkX, newChunkY).entities.add(this);
        }
        return valid;
    }
}
