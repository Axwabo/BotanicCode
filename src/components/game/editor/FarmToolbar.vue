<script setup lang="ts">
import ToolButton from "./ToolButton.vue";
import ToolView from "./ToolView.vue";
import TilePlacer from "./tools/TilePlacer.vue";
import FencePlacer from "./tools/FencePlacer.vue";
import ClearTile from "./tools/ClearTile.vue";
import BotInspector from "./tools/BotInspector.vue";
import isTutorialSequence from "../../../tutorialStore.ts";

const outline = isTutorialSequence("tools");
</script>

<template>
    <div class="farm-toolbar" :class="{ outline }">
        <div class="tool-selector">
            <ToolButton tool="Inspector"/>
            <ToolButton tool="Tile Placer"/>
            <ToolButton tool="Fence Placer"/>
            <ToolButton tool="Clear Tile"/>
        </div>
        <ToolView tool="Inspector">
            <BotInspector/>
        </ToolView>
        <ToolView tool="Tile Placer">
            <TilePlacer/>
        </ToolView>
        <ToolView tool="Fence Placer">
            <FencePlacer/>
        </ToolView>
        <ToolView tool="Clear Tile">
            <ClearTile/>
        </ToolView>
    </div>
</template>

<style scoped>
.farm-toolbar {
    min-height: 0;
    display: grid;
    grid-template-columns: max-content auto;
    gap: 0.5rem;
}

.tool-selector {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
</style>
