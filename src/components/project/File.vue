<script setup lang="ts">
import { activeEditorFileName } from "../../activeEditor.ts";

const { filename } = defineProps<{ filename: string; }>();
</script>

<template>
    <button v-on:click="activeEditorFileName = filename">{{ filename }}</button>
</template>

<style scoped>

</style>
