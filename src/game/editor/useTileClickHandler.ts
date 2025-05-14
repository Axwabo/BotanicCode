import { onMounted, onUnmounted } from "vue";
import { editorHandler } from "../main.ts";
import type TileClickEvent from "./tileClickEvent.ts";
import type { Tile } from "../tile.ts";

export default function useTileClickHandler(handler: (tile: Tile) => void) {
    const handleClick = (event: Event) => {
        const tileEvent = <TileClickEvent>event;
        handler(tileEvent.board.getTile(tileEvent.tileX, tileEvent.tileY));
    };
    onMounted(() => editorHandler.addEventListener("tileclick", handleClick));
    onUnmounted(() => editorHandler.removeEventListener("tileclick", handleClick));
}
