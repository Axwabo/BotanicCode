<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import EditorView from "./components/editor/EditorView.vue";
import TemplateDialog from "./components/TemplateDialog.vue";
import { defineAsyncComponent, ref } from "vue";

const project = defineAsyncComponent(() => import("./components/project/ProjectView.vue"));
const game = defineAsyncComponent(() => import("./components/game/GameView.vue"));

const activated = ref(false);
</script>

<template>
    <PWABadge v-on:activated="activated = true"/>
    <template v-if="activated">
        <project/>
        <EditorView/>
        <game/>
        <TemplateDialog/>
    </template>
    <p v-else>Please wait...</p>
</template>
