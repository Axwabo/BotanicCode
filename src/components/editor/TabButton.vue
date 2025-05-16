<script setup lang="ts">
import { storeToRefs } from "pinia";
import useFileStore from "../../fileStore.ts";
import { computed } from "vue";

const { file } = defineProps<{ file: string; }>();

const { files, navigate, close } = useFileStore();

const { currentFile } = storeToRefs(useFileStore());

const status = computed(() => files.get(file));

function handleClick(event: MouseEvent) {
    if (event.button === 1)
        close(file);
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

.close {
    display: inline-block;
    opacity: 0;
    padding: 0 0.25em;
    margin-right: 0.25em;
    font-size: 0.75em;
    border-radius: 100%;
}

.file:hover .close, .close:focus {
    opacity: 1;
}

.close:hover {
    background-color: #fff5;
}

.highlighted {
    border-bottom: 2px solid aqua;
}
</style>
