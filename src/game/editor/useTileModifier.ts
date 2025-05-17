import { onMounted, onUnmounted } from "vue";
import type ClickEvent from "../events/clickEvent.ts";
import type { Tile } from "../../util/tile.d.ts";
import { editorHandler } from "../events/editorHandler.ts";
import TileUpdatedEvent from "../../util/world/events/tileUpdatedEvent";

export default function useTileModifier(handler: (tile: Tile) => void) {
    const handleClick = (event: ClickEvent) => {
        const tileEvent = event;
        const tile = tileEvent.board.getTile(tileEvent.tileX, tileEvent.tileY);
        handler(tile);
        editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
    };
    onMounted(() => editorHandler.addEventListener("click", handleClick));
    onUnmounted(() => editorHandler.removeEventListener("click", handleClick));
}
