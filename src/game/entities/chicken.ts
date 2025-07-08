import type { GrowingPlant } from "../../util/tile";
import ScavengerAnimal from "./scavengerAnimal.ts";

export default class Chicken extends ScavengerAnimal {

    protected canEat(data: GrowingPlant): boolean {
        return data.type === "wheat" && data.growthPercentage < 0.3;
    }

    // @ts-ignore
    protected getEnergy(data: GrowingPlant): number {
        return 0.05;
    }

}
