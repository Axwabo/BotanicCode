<script setup lang="ts">
import useGameStore from "../../gameStore.ts";
import FarmEditor from "./FarmEditor.vue";

const { resetPosition, resetBoard } = useGameStore();
</script>

<template>
    <div class="game-top-controls">
        <span class="view-label">Farm</span>
        <button v-on:click="resetPosition">Back to (0, 0)</button>
        <button v-on:click="resetBoard">Reset Board</button>
    </div>
    <FarmEditor/>
</template>

<style scoped>
.game-top-controls {
    display: flex;
    align-items: center;
    gap: 0.5em;
}
</style>
