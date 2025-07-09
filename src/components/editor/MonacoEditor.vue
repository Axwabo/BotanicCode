<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import * as monaco from "monaco-editor";
import useFileStore from "../../fileStore.ts"
import { editorConstruction, ensureMonacoEnvironment, watchSettings } from "../../game/editor/environment.ts";

const { path } = defineProps<{ path: string; }>();

const { files, editors } = useFileStore();

const instance = editors.get(path)!;

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const element = ref<HTMLDivElement>();

const locked = computed(() => files.get(path) === "locked");

watchSettings(() => editor);

onMounted(() => {
    ensureMonacoEnvironment();
    editor = monaco.editor.create(element.value!, {
        ...editorConstruction(),
        language: path.endsWith(".ts") ? "typescript" : "javascript",
        theme: "vs-dark",
        value: instance.text,
        readOnly: locked.value,
        automaticLayout: true
    });
    editor.onDidChangeModelContent(() => files.set(path, "modified"));
    instance.contents = () => editor!.getValue();
    window.addEventListener("resize", layout);
});

onUnmounted(() => {
    editor?.dispose();
    instance.contents = () => "";
    window.removeEventListener("resize", layout);
});

function layout() {
    editor?.layout({ width: 0, height: 0 });
}
</script>

<template>
    <div class="monaco-container" :data-path="path" ref="element" :class="{ locked }"></div>
</template>

<style scoped>
.monaco-container {
    position: relative;
    height: 100%;
}

.monaco-container.locked::after {
    content: "";
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(135deg, transparent 1px, rgba(100, 100, 100, 0.1) 3px, transparent 5px, transparent 15px);
}
</style>
