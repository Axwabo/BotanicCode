import type { Board } from "../../util/world/board";
import type { GrowingPlant, PlantType } from "../../util/tile";

function plant(board: Board, tileX: number, tileY: number, type: PlantType, maxAge: number) {
    const tile = board.getTile(tileX, tileY);
    const plant: GrowingPlant = {
        type,
        ageSeconds: 0,
        tick(deltaSeconds: number) {
            this.ageSeconds += deltaSeconds;
        },
        get growthPercentage(): number {
            return Math.min(1, this.ageSeconds / maxAge);
        }
    };
    tile.data = plant;
    return plant;
}

export function plantWheat(board: Board, tileX: number, tileY: number) {
    return plant(board, tileX, tileY, "wheat", 30);
}

export function plantCarrot(board: Board, tileX: number, tileY: number) {
    return plant(board, tileX, tileY, "carrot", 20);
}

export function plantPotato(board: Board, tileX: number, tileY: number) {
    return plant(board, tileX, tileY, "potato", 20);
}
