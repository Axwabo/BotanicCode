import type { Board } from "../../util/world/board";
import type { GrowingPlant, PlantType } from "../../util/tile";
import { editorHandler } from "../events/editorHandler.ts";
import TileUpdatedEvent from "../../util/world/events/tileUpdated";

const ages: Record<PlantType, number> = {
    carrot: 20,
    wheat: 30,
    potato: 35,
    tomato: 25,
    strawberry: 20
};

export function plant(board: Board, tileX: number, tileY: number, type: PlantType) {
    const tile = board.getTile(tileX, tileY);
    if (tile.data)
        return;
    const maxAge = ages[type];
    const plant: GrowingPlant = {
        type,
        ageSeconds: 0,
        tick(deltaSeconds: number) {
            this.ageSeconds += deltaSeconds;
            return this.ageSeconds - deltaSeconds < maxAge;
        },
        get growthPercentage(): number {
            return Math.min(1, this.ageSeconds / maxAge);
        }
    };
    tile.data = plant;
    editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
    return plant;
}
