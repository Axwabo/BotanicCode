<script setup lang="ts">
import ToolButton from "./ToolButton.vue";
import ToolView from "./ToolView.vue";
import TilePlacer from "./tools/TilePlacer.vue";
import FencePlacer from "./tools/FencePlacer.vue";
import ClearTile from "./tools/ClearTile.vue";
</script>

<template>
    <div class="farm-toolbar">
        <div class="tool-selector">
            <ToolButton tool="Tile Placer"/>
            <ToolButton tool="Fence Placer"/>
            <ToolButton tool="Clear Tile"/>
        </div>
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tool-selector {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
</style>
