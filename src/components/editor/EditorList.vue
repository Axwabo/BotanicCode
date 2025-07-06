<script setup lang="ts">
import useFileStore from "../../fileStore.ts";
import TabButton from "./TabButton.vue";
import isTutorialSequence from "../../tutorialStore.ts";

const { editors } = useFileStore();

const outline = isTutorialSequence("tabs");
</script>

<template>
    <nav id="editorList" :class="{ outline }">
        <TabButton file="-" class="invisible"/>
        <TabButton v-for="file in editors.keys()" :key="file" :file="file"/>
    </nav>
</template>

<style scoped>
#editorList {
    max-width: 100%;
    overflow-x: scroll;
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
}

.invisible {
    width: 0;
    visibility: hidden;
}
</style>
