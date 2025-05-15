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
    depth: number;
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
    process(flatStatuses, "/", listing);
    return listing;
});

function process(statuses: { path: string, status: FileStatus }[], root: string, list: ListItem[], depth: number = 0, start: number = 0) {
    let count = 0;
    for (let i = start; i < statuses.length; i++) {
        const { path, status } = statuses[i];
        if (!path.startsWith(root))
            break;
        count++;
        const descendant = path.substring(root.length);
        const slash = descendant.indexOf("/", 1);
        if (slash === -1) {
            list.push({ path, status, start: root.length + 1, length: path.length, depth });
            continue;
        }
        const directory = root + descendant.substring(0, slash);
        list.push({ path: descendant, start: +(root !== "/"), length: slash, depth });
        list.push({ path, status, start: directory.length + 1, length: path.length, depth: depth + 1 });
        const processed = process(statuses, directory, list, depth + 1, i + 1);
        i += processed;
        count += processed;
    }
    return count;
}
</script>

<template>
    <p v-if="sorted.length === 0" class="empty">No files</p>
    <div class="file-list">
        <template v-for="{path, start, length, status, depth} in sorted" :key="path">
            <File v-if="status" :path="path" :filename="path.substring(start, length)" :status="status" :style="`margin-left: ${depth}rem`"/>
            <span v-else :style="`margin-left: ${depth}rem`">{{ path.substring(start, length) }}</span>
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
