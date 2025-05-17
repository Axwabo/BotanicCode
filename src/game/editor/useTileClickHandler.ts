import { onMounted, onUnmounted } from "vue";
import { editorHandler } from "../main.ts";
import type ClickEvent from "./clickEvent.ts";

import type { Tile } from "../../util/tile.d.ts";

export default function useTileClickHandler(handler: (tile: Tile) => void) {
    const handleClick = (event: Event) => {
        const tileEvent = <ClickEvent>event;
        handler(tileEvent.board.getTile(tileEvent.tileX, tileEvent.tileY));
    };
    onMounted(() => editorHandler.addEventListener("click", handleClick));
    onUnmounted(() => editorHandler.removeEventListener("click", handleClick));
}
