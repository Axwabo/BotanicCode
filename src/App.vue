<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import ProjectView from "./components/project/ProjectView.vue";
import EditorView from "./components/editor/EditorView.vue";
import { defineAsyncComponent } from "vue";

const game = defineAsyncComponent(() => import("./components/GameView.vue"));
</script>

<template>
    <ProjectView/>
    <EditorView/>
    <game/>
    <PWABadge/>
</template>

<style scoped></style>
