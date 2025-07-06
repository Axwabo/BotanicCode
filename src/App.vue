<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import TutorialDialog from "./components/tutorial/TutorialDialog.vue";
import EditorView from "./components/editor/EditorView.vue";
import ProjectView from "./components/project/ProjectView.vue";
import GameView from "./components/game/GameView.vue";
</script>

<template>
    <PWABadge/>
    <ProjectView/>
    <EditorView/>
    <GameView/>
    <TutorialDialog/>
</template>
