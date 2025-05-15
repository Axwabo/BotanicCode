<script setup lang="ts">
import useFileStore, { type FileStatus } from "../../fileStore.ts";

const { name, status } = defineProps<{ path: string; name: string; status: FileStatus; }>();

const { navigate } = useFileStore();
</script>

<template>
    <button v-on:click="navigate(path)" :class="status">{{ name }}</button>
</template>

<style scoped>
.modified, .created {
    font-style: italic;
}

.created {
    color: #f88;
}
</style>
