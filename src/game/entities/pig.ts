import IdlingEntity from "./idlingEntity.ts";
import ManagedBoard from "../managedBoard.ts";
import type { GrowingPlant, Tile, TileData, WorldPosition } from "../../util/tile";
import type { Behavior } from "./behavior.ts";
import { findTileCircle } from "../../util/world/locator";
import { tileSize, worldCenter } from "../../util/tileConstants";
import { isPlant } from "../plants/harvesting.ts";
import { editorHandler } from "../events/editorHandler.ts";
import TileUpdatedEvent from "../../util/world/events/tileUpdated";

export default class Pig extends IdlingEntity {

    constructor(board: ManagedBoard, position: WorldPosition, radius: number, speed: number) {
        super(board, position, "pig", radius, speed);
    }

    protected* behavior(): Behavior {
        while (true) {
            if (this.energy > 0.8) {
                yield* this.movement.moveIldlyOnce();
                continue;
            }
            const tile = findTileCircle(this.board, Math.floor(this.position.x / tileSize), Math.floor(this.position.y / tileSize), 5, isEdibleTile);
            if (!tile) {
                yield* this.movement.moveIldlyOnce();
                continue;
            }
            this.movement.target = worldCenter(tile);
            yield* this.movement.goToTarget();
            yield Math.random() * 2 + 1;
            const data = tile.data;
            if (!isEdible(data))
                continue;
            tile.data = undefined;
            editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
            this.depleteEnergy(-0.05 * data.growthPercentage);
        }
    }

}

function isEdibleTile(t: Tile) {
    return !!t.data && isEdible(t.data);
}

function isEdible(data: TileData): data is GrowingPlant {
    return isPlant(data) && isEdibleType(data.type) && data.growthPercentage > 0.5;
}

function isEdibleType(type: TileData["type"]) {
    return type === "potato" || type === "wheat" || type === "carrot";
}
