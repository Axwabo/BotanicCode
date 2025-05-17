<script setup lang="ts">
import useFileStore from "../../fileStore.ts";
import TabButton from "./TabButton.vue";

const { editors } = useFileStore();
</script>

<template>
    <nav id="editorList">
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
</style>
