<script setup lang="ts">
import type { Tool } from "../../../game/editor/editorTypes.ts";
import { storeToRefs } from "pinia";
import useEditorStore from "../../../editorStore.ts";

const { tool: selectedTool } = storeToRefs(useEditorStore());

const { tool } = defineProps<{ tool: Tool; }>();
</script>

<template>
    <button :class="{ selected: selectedTool === tool }" v-on:click="selectedTool = tool">{{ tool }}</button>
</template>

<style scoped>
.selected {
    color: greenyellow;
}
</style>
