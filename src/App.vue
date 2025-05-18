<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import EditorView from "./components/editor/EditorView.vue";
import TemplateDialog from "./components/TemplateDialog.vue";
import { defineAsyncComponent } from "vue";

const project = defineAsyncComponent(() => import("./components/project/ProjectView.vue"));
const game = defineAsyncComponent(() => import("./components/game/GameView.vue"));
</script>

<template>
    <project/>
    <EditorView/>
    <game/>
    <PWABadge/>
    <TemplateDialog/>
</template>

<style scoped></style>
