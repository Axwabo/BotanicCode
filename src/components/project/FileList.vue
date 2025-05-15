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
    process(flatStatuses, "/", listing);
    return listing;
});

function process(statuses: { path: string, status: FileStatus }[], root: string, list: ListItem[]) {
    // TODO: SLIDING WINDOW OMG
    const subdirectories = new Map<string, Record<string, FileStatus>>();
    for (const { path, status } of statuses) {
        const descendant = path.substring(root.length);
        if (!descendant)
            continue;
        const slash = descendant.indexOf("/", 1);
        if (slash === -1) {
            list.push({ path, status, start: root.length, length: path.length });
            continue;
        }
        const directory = root + descendant.substring(0, slash);
        if (directory.indexOf("/", 1) !== -1) {

            break;
        }
        let subdirectory = subdirectories.get(directory);
        if (!subdirectory) {
            list.push({ path: directory, start: root.length, length: slash + 1 });
            subdirectories.set(directory, subdirectory = {});
        }
        subdirectory[path] = status;
    }
}
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
