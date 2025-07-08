import IdlingEntity from "./idlingEntity.ts";
import type { Tile } from "../../util/tile";
import type { Behavior } from "./behavior.ts";
import { findTileCircle } from "../../util/world/locator";
import { tileSize, worldCenter } from "../../util/tileConstants";

export default abstract class ScavengerAnimal extends IdlingEntity {

    protected* behavior(): Behavior {
        while (true) {
            if (!this.wantsToEat) {
                yield* this.movement.moveIldlyOnce();
                continue;
            }
            if (yield* this.eatNearbyItem())
                continue;
            const tile = this.findEdibleTile();
            if (tile)
                yield* this.eatTile(tile);
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
            t => this.canEat(t, true)
        );
    }

    private* eatTile(tile: Tile): Behavior {
        this.movement.target = worldCenter(tile);
        yield* this.movement.goToTarget();
        yield Math.random() * 2 + 1;
        if (this.canEat(tile, false))
            this.consume(tile);
    }

    protected abstract canEat(tile: Tile, locating: boolean): boolean;

    protected abstract consume(tile: Tile): void;

}
