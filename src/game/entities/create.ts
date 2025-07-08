import type ManagedBoard from "../managedBoard.ts";
import type { WorldPosition } from "../../util/tile";
import type { EntityType } from "../../bot/sdk/entities";
import type { ManagedEntity } from "./interfaces.ts";
import { tileSize } from "../../util/tileConstants";
import RuminantAnimal from "./ruminantAnimal.ts";
import Pig from "./pig.ts";
import Chicken from "./chicken.ts";

function createRuminant(board: ManagedBoard, position: WorldPosition, type: EntityType, radiusScalar: number, speedScalar: number = radiusScalar): ManagedEntity {
    return new RuminantAnimal(board, position, type, tileSize * radiusScalar, tileSize * speedScalar);
}

export function createCow(board: ManagedBoard, position: WorldPosition) {
    return createRuminant(board, position, "cow", 0.8, 0.5);
}

export function createPig(board: ManagedBoard, position: WorldPosition) {
    return new Pig(board, position, "pig", tileSize * 0.6, tileSize * 0.6);
}

export function createSheep(board: ManagedBoard, position: WorldPosition) {
    return createRuminant(board, position, "sheep", 0.5, 0.6);
}

export function createChicken(board: ManagedBoard, position: WorldPosition) {
    return new Chicken(board, position, "chicken", tileSize * 0.3, tileSize * 0.6);
}
