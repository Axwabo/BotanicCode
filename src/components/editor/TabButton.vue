<script setup lang="ts">
import { storeToRefs } from "pinia";
import useFileStore from "../../fileStore.ts";
import { computed } from "vue";

const { file } = defineProps<{ file: string; }>();

const { files, editors, navigate } = useFileStore();

const { currentFile } = storeToRefs(useFileStore());

const status = computed(() => files.get(file));

function close() {
    const current = currentFile.value;
    let editorPaths = editors.keys();
    let openIndex = -1;
    let i = 0;
    while (true) {
        const { value, done } = editorPaths.next();
        if (value === current) {
            openIndex = i;
            break;
        }
        i++;
        if (done)
            break;
    }
    editors.delete(file);
    if (current !== file)
        return;
    if (!editors.size) {
        currentFile.value = "";
        return;
    }
    const targetIndex = Math.max(0, Math.min(editors.size - 1, openIndex));
    editorPaths = editors.keys();
    let targetPath = "";
    for (i = 0; i <= targetIndex; i++)
        targetPath = editorPaths.next().value!;
    navigate(targetPath);
}

function handleClick(event: MouseEvent) {
    if (event.button === 1)
        close();
    else
        navigate(file);
}
</script>

<template>
    <div :class="{ file: true, highlighted: file === currentFile }">
        <button v-on:mouseup="handleClick" class="navigate">
            <span :class="status">{{ file }}</span>
        </button>
        <button v-on:click="close" class="close">X</button>
    </div>
</template>

<style scoped>
.file {
    background-color: #444;
}

.file button {
    border: none;
    background-color: transparent;
}

.navigate {
    padding-bottom: 0.25rem;
}

.file:hover {
    background-color: #777;
}

.file:hover .close {
    visibility: visible;
}

.close {
    display: inline-block;
    visibility: hidden;
    padding: 0 0.25em;
    margin-right: 0.25em;
    font-size: 0.75em;
    border-radius: 100%;
}

.close:hover {
    background-color: #fff5;
}

.highlighted {
    border-bottom: 2px solid aqua;
}
</style>
