import IdlingEntity from "./idlingEntity.ts";
import type { Behavior } from "./behavior.ts";
import type { ItemType } from "../../bot/sdk/items";

export default class RuminantAnimal extends IdlingEntity {
    protected readonly edibleItems: ItemType[] = [ "wheat" ];
    private eatingCooldown: number = 0;

    tick(deltaSeconds: number) {
        this.eatingCooldown -= deltaSeconds;
        super.tick(deltaSeconds);
    }

    protected* behavior(): Behavior {
        while (true) {
            yield* this.movement.moveIldlyOnce();
            if (this.eatingCooldown > 0 || !this.wantsToEat)
                continue;
            if (!(yield* this.eatNearbyItem()))
                yield* this.eatGrass();
        }
    }

    protected* eatGrass(): Behavior {
        const tile = this.board.getTileAt(this.position.x, this.position.y);
        if (tile.type !== "grass")
            return;
        yield Math.random() * 2 + 1;
        tile.type = "dirt";
        this.notifyTileUpdate(tile);
        this.depleteEnergy(-0.05);
        this.eatingCooldown = 10;
        yield Math.random() + 1;
    }
}
