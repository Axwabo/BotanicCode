<script setup lang="ts">
import FacingCheckbox from "./FacingCheckbox.vue";
import useEditorStore from "../../../../editorStore.ts";
import useTileClickHandler from "../../../../game/editor/useTileClickHandler.ts";

const { facings } = useEditorStore();

useTileClickHandler(tile => tile.data = { type: "fence", posts: Array.from(facings) });
</script>

<template>
    <div class="facing-checkboxes">
        <FacingCheckbox facing="north" style="grid-column: 2;"/>
        <FacingCheckbox facing="west" style="grid-row: 2;"/>
        <FacingCheckbox facing="east" style="grid-row: 2; grid-column: 3;"/>
        <FacingCheckbox facing="south" style="grid-row: 3; grid-column: 2;"/>
    </div>
</template>

<style scoped>
.facing-checkboxes {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-template-rows: repeat(3, max-content);
}
</style>
