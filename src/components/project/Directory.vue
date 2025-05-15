<script setup lang="ts">
import { type FileStatus } from "../../fileStore.ts";
import DirectoryListing from "./DirectoryListing.vue";
import { reactive, watch } from "vue";

const { path, name, files } = defineProps<{ path: string; name: string; files: Map<string, FileStatus>; }>();

const subdirectories = reactive(new Map<string, Map<string, FileStatus>>());
const root = reactive(new Map<string, FileStatus>());

watch(() => files, newFiles => {
    // TODO: not updating
    subdirectories.clear();
    root.clear();
    for (const [ file, status ] of newFiles) {
        const descendant = file.substring(path.length);
        if (!descendant)
            continue;
        const slash = descendant.indexOf("/", 1);
        if (slash === -1) {
            root.set(file, status);
            continue;
        }
        const directory = path + descendant.substring(0, slash);
        let subdirectory = subdirectories.get(directory);
        if (!subdirectory)
            subdirectories.set(directory, subdirectory = reactive(new Map<string, FileStatus>()));
        subdirectory.set(file, status);
    }
}, { immediate: true });
</script>

<template>
    <details v-if="name">
        <summary>{{ name }}</summary>
        <DirectoryListing :path="path" :files="root" :directories="subdirectories"/>
    </details>
    <DirectoryListing v-else :path="path" :files="root" :directories="subdirectories"/>
</template>
