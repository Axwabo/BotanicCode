<script setup lang="ts">
import useGameStore from "../../gameStore.ts";
import FarmEditor from "./FarmEditor.vue";
import isTutorialSequence from "../../tutorialStore.ts";

const { resetPosition, resetBoard } = useGameStore();

const outline = isTutorialSequence("actions");
</script>

<template>
    <div :class="{ 'view-title-bar': true, outline }">
        <span class="view-label">Farm</span>
        <button v-on:click="resetPosition">Back to (0, 0)</button>
        <button v-on:click="resetBoard">Reset Board</button>
    </div>
    <FarmEditor/>
</template>
