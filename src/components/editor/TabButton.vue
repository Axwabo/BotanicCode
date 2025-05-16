<script setup lang="ts">
import { storeToRefs } from "pinia";
import useFileStore from "../../fileStore.ts";

const { file } = defineProps<{ file: string; }>();

const { editors, navigate } = useFileStore();

const { currentFile } = storeToRefs(useFileStore());

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
    if (current !== file || !editors.size)
        return;
    const targetIndex = Math.max(0, Math.min(editors.size - 1, openIndex));
    editorPaths = editors.keys();
    let targetPath = "";
    for (i = 0; i <= targetIndex; i++)
        targetPath = editorPaths.next().value;
    navigate(targetPath);
}

function handleClick(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    if (target?.innerText === "X")
        return;
    if (event.button === 1)
        close();
    else
        navigate(file);
}
</script>

<template>
    <button v-on:mouseup="handleClick" :class="{ file: true, highlighted: file === currentFile }">
        <span>{{ file }}</span>
        <button v-on:click="close" class="close">X</button>
    </button>
</template>

<style scoped>

.file {
    border: none;
    box-sizing: border-box;
    padding: 0.25em;
}

.highlighted {
    border-bottom: 2px solid aqua;
}

.file:hover .close {
    visibility: visible;
}

.close {
    display: inline-block;
    visibility: hidden;
    padding: 0 0.25em;
    margin-left: 0.25em;
    font-size: 0.75em;
}
</style>
