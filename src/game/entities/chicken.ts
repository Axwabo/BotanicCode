import type { Tile } from "../../util/tile";
import ScavengerAnimal from "./scavengerAnimal.ts";

export default class Chicken extends ScavengerAnimal {

    protected canEat(tile: Tile, locating: boolean): boolean {
        return tile.type === "grass" && !tile.data && (!locating || Math.random() < 0.1);
    }

    // @ts-ignore
    protected consume(tile: Tile): void {
        this.depleteEnergy(-0.05);
    }

}
