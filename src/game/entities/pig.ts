import type { Tile, TileData } from "../../util/tile";
import ScavengerAnimal from "./scavengerAnimal.ts";
import { isPlant } from "../plants/harvesting.ts";

export default class Pig extends ScavengerAnimal {

    protected canEat(tile: Tile) {
        return !!tile.data && isPlant(tile.data) && isEdibleType(tile.data.type) && tile.data.growthPercentage > 0.5;
    }

    protected consume(tile: Tile): void {
        if (!tile.data || !isPlant(tile.data))
            return;
        const energy = 0.05 * tile.data.growthPercentage;
        tile.data = undefined;
        this.notifyTileUpdate(tile);
        this.depleteEnergy(-energy);
    }

}

function isEdibleType(type: TileData["type"]) {
    return type === "potato" || type === "wheat" || type === "carrot";
}
