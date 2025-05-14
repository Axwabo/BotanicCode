<script setup lang="ts">
import useTileClickHandler from "../../../../game/editor/useTileClickHandler.ts";

useTileClickHandler(tile => tile.data = undefined);
</script>

<template>
    <p>Click a tile to clear its data</p>
</template>
