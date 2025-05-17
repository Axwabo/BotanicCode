<script setup lang="ts">
import useTileModifier from "../../../../game/editor/useTileModifier.ts";

useTileModifier(tile => tile.data = undefined);
</script>

<template>
    <p>Click a tile to clear its data</p>
</template>
