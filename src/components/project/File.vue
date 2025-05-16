<script setup lang="ts">
import useFileStore, { type FileStatus } from "../../fileStore.ts";
import { storeToRefs } from "pinia";

const { path, filename, status } = defineProps<{ path: string; filename: string; status: FileStatus; }>();

const { navigate } = useFileStore();

const { deleteConfirmation } = storeToRefs(useFileStore());
</script>

<template>
    <button v-on:click="navigate(path)" :class="status" @contextmenu.prevent="deleteConfirmation = path">{{ filename }}</button>
</template>

<style>
.modified, .created {
    font-style: italic;
}

.modified::after {
    content: "*";
}

.created {
    color: #f88;
}
</style>
