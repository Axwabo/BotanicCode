<script setup lang="ts">
import useFileStore from "../../fileStore.ts";
import Directory from "./Directory.vue";
import { storeToRefs } from "pinia";

const { files } = storeToRefs(useFileStore());

await navigator.serviceWorker.ready;

const response = await fetch("file-list/bot");

if (response.ok && response.headers.get("Content-Type") === "text/plain") {
    const text = await response.text();
    const lines = text.split("\n");
    for (const line of lines)
        if (line)
            files.value.set(line, "saved");
}
</script>

<template>
    <p v-if="files.size === 0" class="empty">No files</p>
    <Directory path="/" name="" :files="files"/>
</template>

<style scoped>
p.empty {
    color: #888;
}
</style>
