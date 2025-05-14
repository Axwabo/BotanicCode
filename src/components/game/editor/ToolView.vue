<script setup lang="ts">
import type { Tool } from "../../../game/editor/editorTypes.ts";
import useEditorStore from "../../../editorStore.ts";

const { isTool } = useEditorStore();

const { tool } = defineProps<{ tool: Tool; }>();
</script>

<template>
    <slot v-if="isTool(tool)"/>
</template>
