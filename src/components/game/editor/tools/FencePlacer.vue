<script setup lang="ts">
import FacingCheckbox from "./FacingCheckbox.vue";
import useEditorStore from "../../../../editorStore.ts";
import useTileClickHandler from "../../../../game/editor/useTileClickHandler.ts";

const { facings } = useEditorStore();

useTileClickHandler(tile => tile.data = { type: "fence", posts: Array.from(facings) });
</script>

<template>
    <div class="facing-checkboxes">
        <FacingCheckbox facing="north"/>
        <FacingCheckbox facing="east"/>
        <FacingCheckbox facing="south"/>
        <FacingCheckbox facing="west"/>
    </div>
</template>

<style scoped>
.facing-checkboxes {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr;
}
</style>
