<script setup lang="ts">
import File from "./File.vue";
import useFileStore from "../../fileStore.ts";

const { files } = useFileStore();

await navigator.serviceWorker.ready;

const response = await fetch("file-list/bot");
if (response.ok && response.headers.get("Content-Type") === "text/plain") {
    const text = await response.text();
    const lines = text.split("\n");
    for (const line of lines)
        if (line)
            files.set(line, "saved");
}
</script>

<template>
    <p v-if="files.size === 0" class="empty">No files</p>
    <div class="file-list">
        <File v-for="[file, status] in files" :key="file" :filename="file" :status="status"/>
    </div>
</template>

<style scoped>
p.empty {
    color: #888;
}

.file-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
