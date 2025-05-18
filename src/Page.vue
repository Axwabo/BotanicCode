<script setup lang="ts">

import GameView from "./components/game/GameView.vue";
import ProjectView from "./components/project/ProjectView.vue";
import EditorView from "./components/editor/EditorView.vue";
import TemplateDialog from "./components/TemplateDialog.vue";
</script>

<template>
    <ProjectView/>
    <EditorView/>
    <GameView/>
    <TemplateDialog/>
</template>
