import IdlingEntity from "./idlingEntity.ts";
import type { GrowingPlant, Tile, TileData } from "../../util/tile";
import type { Behavior } from "./behavior.ts";
import { findTileCircle } from "../../util/world/locator";
import { tileSize, worldCenter } from "../../util/tileConstants";
import { isPlant } from "../plants/harvesting.ts";

export default class ScavengerAnimal extends IdlingEntity {

    protected* behavior(): Behavior {
        while (true) {
            if (this.energy > 0.8) {
                yield* this.movement.moveIldlyOnce();
                continue;
            }
            const tile = this.findEdibleTile();
            if (tile)
                this.eatTile(tile);
            else
                yield* this.movement.moveIldlyOnce();
        }
    }

    private findEdibleTile() {
        return findTileCircle(
            this.board,
            Math.floor(this.position.x / tileSize),
            Math.floor(this.position.y / tileSize),
            5,
            t => this.isEdible(t.data)
        );
    }

    private* eatTile(tile: Tile): Behavior {
        this.movement.target = worldCenter(tile);
        yield* this.movement.goToTarget();
        yield Math.random() * 2 + 1;
        if (!this.isEdible(tile.data))
            return;
        const energy = this.getEnergy(tile.data);
        tile.data = undefined;
        this.notifyTileUpdate(tile);
        this.depleteEnergy(-energy);
    }

    private isEdible(data?: TileData): data is GrowingPlant {
        return !!data && isPlant(data) && this.canEat(data);
    }

    protected canEat(data: GrowingPlant): boolean {
        return data.growthPercentage > 0.5;
    }

    protected getEnergy(data: GrowingPlant) {
        return 0.05 * data.growthPercentage;
    }

}
