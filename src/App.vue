<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import ProjectView from "./components/project/ProjectView.vue";
import EditorView from "./components/editor/EditorView.vue";
import GameView from "./components/GameView.vue";
</script>

<template>
    <ProjectView/>
    <EditorView/>
    <GameView/>
    <PWABadge/>
</template>

<style scoped></style>
