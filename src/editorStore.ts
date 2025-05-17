import { defineStore } from "pinia";
import type { Tool } from "./game/editor/editorTypes.ts";
import type { Facing, TileType } from "./util/tile.d.ts";

interface State {
    tool: Tool;
    tileType: TileType;
    facings: Set<Facing>;
    selectedBot: string;
}

const useEditorStore = defineStore("editor", {
    state: (): State => ({
        tool: "Inspector",
        tileType: "gravel",
        facings: new Set<Facing>(),
        selectedBot: ""
    }),
    actions: {
        isTool(tool: Tool) {
            return this.tool === tool;
        }
    }
});

export default useEditorStore;
