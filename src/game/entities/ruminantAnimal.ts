import IdlingEntity from "./idlingEntity.ts";
import { editorHandler } from "../events/editorHandler.ts";
import TileUpdatedEvent from "../../util/world/events/tileUpdated";

export default class RuminantAnimal extends IdlingEntity {
    tick(deltaSeconds: number) {
        super.tick(deltaSeconds);
        if (this.energy > 0.8 || this.movement.waitTime < 2 || !!this.movement.target)
            return;
        const tile = this.board.getTileAt(this.position.x, this.position.y);
        if (tile.type !== "grass")
            return;
        tile.type = "dirt";
        editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
        this.depleteEnergy(-0.03);
    }
}
