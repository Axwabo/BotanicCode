import type { GrowingPlant, TileData } from "../../util/tile";
import ScavengerAnimal from "./scavengerAnimal.ts";

export default class Pig extends ScavengerAnimal {

    protected canEat(data: GrowingPlant): boolean {
        return isEdibleType(data.type) && data.growthPercentage > 0.5;
    }

}

function isEdibleType(type: TileData["type"]) {
    return type === "potato" || type === "wheat" || type === "carrot";
}
