<script setup lang="ts">
import useFileStore, { type FileStatus } from "../../fileStore.ts";

const { path, filename, status } = defineProps<{ path: string; filename: string; status: FileStatus; }>();

const { navigate } = useFileStore();
</script>

<template>
    <button v-on:click="navigate(path)" :class="status">{{ filename }}</button>
</template>

<style scoped>
.modified, .created {
    font-style: italic;
}

.created {
    color: #f88;
}
</style>
