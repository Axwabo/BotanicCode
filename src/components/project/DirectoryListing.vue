<script setup lang="ts">
import Directory from "./Directory.vue";
import type { FileStatus } from "../../fileStore.ts";
import File from "./File.vue";
import type { Reactive } from "vue";

const { files, directories, path } = defineProps<{
    files: Reactive<Map<string, FileStatus>>;
    directories: Reactive<Map<string, Map<string, FileStatus>>>;
    path: string;
}>();
</script>

<template>
    <div :class="{ directory: true, indent: path !== '/' }">
        <Directory v-for="[subpath, files] of directories" :key="subpath" :path="subpath" :name="subpath.substring(path.length + (path === '/' ? 0 : 1))" :files="files"/>
        <File v-for="[file, status] in files" :key="path" :path="file" :name="file.substring(path.length + 1)" :status="status"/>
    </div>
</template>

<style scoped>
.directory {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.indent {
    margin-left: 1rem;
}
</style>
