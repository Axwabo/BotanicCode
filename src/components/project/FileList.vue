<script setup lang="ts">
import useFileStore, { type FileStatus } from "../../fileStore.ts";
import { computed } from "vue";
import File from "./File.vue";

const { files } = useFileStore();

await navigator.serviceWorker.ready;

interface ListItem {
    path: string;
    status?: FileStatus;
    start: number;
    length: number;
}

const response = await fetch("file-list/bot");

if (response.ok && response.headers.get("Content-Type") === "text/plain") {
    const text = await response.text();
    const lines = text.split("\n");
    for (const line of lines)
        if (line)
            files.set(line, "saved");
}

const sorted = computed(() => {
    const flatStatuses = Array.from(files).map(([ path, status ]) => ({ path, status }));
    flatStatuses.sort((a, b) => a.path.localeCompare(b.path));
    const listing: ListItem[] = [];
    let pointerDepth = 0;
    let pointerLength = 0;
    let pointer = 0;
    let length = 0;
    while (pointer < flatStatuses.length) {
        const { path, status } = flatStatuses[pointer];
        const split = path.split("/");
        pointerDepth = split.length;
        while (pointer + ++length < flatStatuses.length) {
            console.log(pointer, length)
            const { path: endPath, status: endStatus } = flatStatuses[pointer + length];
            const endSplit = endPath.split("/");
            const depth = endSplit.length;
            listing.push({ path: endPath, status: endStatus, start: split.slice(0, pointerDepth - 1).join("/").length, length: endPath.length });
            if (depth < pointerDepth)
                break;
        }
        pointer += length;
        length = 0;
    }
    return listing;
});

</script>

<template>
    <p v-if="sorted.length === 0" class="empty">No files</p>
    <div class="file-list">
        <template v-for="{path, start, length, status} in sorted" :key="path">
            <File v-if="status" :path="path" :filename="path.substring(start, length)" :status="status"/>
            <span v-else>{{ path.substring(start, length) }}</span>
        </template>
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
