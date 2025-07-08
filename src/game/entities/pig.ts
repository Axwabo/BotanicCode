import type { Tile } from "../../util/tile";
import ScavengerAnimal from "./scavengerAnimal.ts";
import { isPlant } from "../plants/harvesting.ts";
import type { ItemType } from "../../bot/sdk/items";

export default class Pig extends ScavengerAnimal {

    protected readonly edibleItems: ItemType[] = [ "carrot", "potato", "wheat" ];

    // @ts-ignore
    protected canEat(tile: Tile, locating: boolean): boolean {
        return !!tile.data && isPlant(tile.data) && this.edibleItems.includes(tile.data.type) && tile.data.growthPercentage > 0.5;
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
