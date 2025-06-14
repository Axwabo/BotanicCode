import type ManagedBoard from "../managedBoard.ts";
import type { WorldPosition } from "../../util/tile";
import type { EntityType } from "../../bot/sdk/entities";
import IdlingEntity from "./idlingEntity.ts";
import type { ManagedEntity } from "./interfaces.ts";
import { tileSize } from "../../util/tileConstants";

function createEntity(board: ManagedBoard, position: WorldPosition, type: EntityType, radiusScalar: number, speedScalar: number = radiusScalar): ManagedEntity {
    return new IdlingEntity(board, position, type, tileSize * radiusScalar, tileSize * speedScalar);
}

export function createCow(board: ManagedBoard, position: WorldPosition) {
    return createEntity(board, position, "cow", 0.8, 0.5);
}

export function createPig(board: ManagedBoard, position: WorldPosition) {
    return createEntity(board, position, "pig", 0.6);
}

export function createSheep(board: ManagedBoard, position: WorldPosition) {
    return createEntity(board, position, "sheep", 0.5, 0.6);
}

export function createChicken(board: ManagedBoard, position: WorldPosition) {
    return createEntity(board, position, "chicken", 0.3, 0.6);
}
