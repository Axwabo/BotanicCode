<script setup lang="ts">
import useFileStore, { type FileStatus } from "../../fileStore.ts";
import { computed } from "vue";
import File from "./File.vue";

const { files, init } = useFileStore();

await init();

interface ListItem {
    path: string;
    status?: FileStatus;
    display: string;
    depth: number;
}

const sorted = computed(() => {
    const flatStatuses = Array.from(files).map(([ path, status ]) => ({ path, status }));
    flatStatuses.sort((a, b) => a.path.localeCompare(b.path));
    const listing: ListItem[] = [];
    process(flatStatuses, listing);
    return listing;
});

function process(statuses: { path: string, status: FileStatus }[], list: ListItem[]) {
    let previousSlash = 0;
    let root = "/";
    for (let i = 0; i < statuses.length; i++) {
        const { path, status } = statuses[i];
        const slash = path.lastIndexOf("/");
        if (slash > previousSlash && path.startsWith(root)) {
            root = path.substring(0, slash);
            let previousIndent = previousSlash;
            let indentSlash = previousSlash;
            while (true) {
                indentSlash = path.indexOf("/", indentSlash + 1);
                if (indentSlash === -1 || indentSlash > slash)
                    break;
                const depth = path.substring(0, indentSlash).split("/").length - 2;
                const directory: ListItem = { path, depth, display: path.substring(previousIndent + 1, indentSlash) };
                if (status === "hidden")
                    directory.status = "hidden";
                list.push(directory);
                previousIndent = indentSlash;
            }
        } else if (slash !== previousSlash)
            root = path.substring(0, slash);
        list.push({ path, status, depth: path.split("/").length - 2, display: path.substring(slash + 1) });
        previousSlash = slash;
    }
}
</script>

<template>
    <p v-if="sorted.length === 0" class="empty">No files</p>
    <div class="file-list">
        <template v-for="{path, display, status, depth} in sorted" :key="path">
            <template v-if="status !== 'hidden'">
                <File v-if="status" :key="path" :path="path" :filename="display" :status="status" :style="`margin-left: ${depth}rem`"/>
                <span v-else :style="`margin-left: ${depth}rem`">{{ display }}</span>
            </template>
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
