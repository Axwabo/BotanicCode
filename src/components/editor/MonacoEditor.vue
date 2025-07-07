<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import * as monaco from "monaco-editor";
import useFileStore from "../../fileStore.ts"
import ensureMonacoEnvironment from "../../game/editor/environment.ts";

const { path } = defineProps<{ path: string; }>();

const { files, editors } = useFileStore();

const instance = editors.get(path)!;

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const element = ref<HTMLDivElement>();

const locked = computed(() => files.get(path) === "locked");

onMounted(() => {
    ensureMonacoEnvironment();
    editor = monaco.editor.create(element.value!, {
        language: path.endsWith(".ts") ? "typescript" : "javascript",
        theme: "vs-dark",
        value: instance.text,
        readOnly: locked.value,
        automaticLayout: true
    });
    editor.onDidChangeModelContent(() => files.set(path, "modified"));
    instance.contents = () => editor!.getValue();
});

onUnmounted(() => {
    editor?.dispose();
    instance.contents = () => "";
});
</script>

<template>
    <div id="monacoEditor" ref="element" :class="{ locked }"></div>
</template>

<style scoped>
#monacoEditor {
    position: relative;
    height: 100%;
}

#monacoEditor.locked::after {
    content: "";
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(135deg, transparent 1px, rgba(100, 100, 100, 0.1) 3px, transparent 4px, transparent 15px);
}
</style>
