<script setup lang="ts">
import useGameStore from "../../gameStore.ts";
import FarmEditor from "./FarmEditor.vue";

const { resetPosition, resetBoard } = useGameStore();
</script>

<template>
    <div class="view-title-bar">
        <span class="view-label">Farm</span>
        <button v-on:click="resetPosition">Back to (0, 0)</button>
        <button v-on:click="resetBoard">Reset Board</button>
    </div>
    <FarmEditor/>
</template>
