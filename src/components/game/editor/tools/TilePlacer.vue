<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../../../../editorStore.ts";
import useTileClickHandler from "../../../../game/editor/useTileClickHandler.ts";

const { tileType } = storeToRefs(useEditorStore());

useTileClickHandler(tile => tile.type = tileType.value);
</script>

<template>
    <div>
        <label for="tileTypeSelector">Tile Type: </label>
        <select v-model="tileType" id="tileTypeSelector">
            <option>grass</option>
            <option>dirt</option>
            <option>gravel</option>
            <option>air</option>
        </select>
    </div>
</template>
