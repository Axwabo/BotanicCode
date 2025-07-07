<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import * as monaco from "monaco-editor";
import useFileStore from "../../fileStore.ts"
import { ensureMonacoEnvironment, watchSettings } from "../../game/editor/environment.ts";

const { path } = defineProps<{ path: string; }>();

const { files, editors } = useFileStore();

const instance = editors.get(path)!;

const editorRef = ref<monaco.editor.IStandaloneCodeEditor>();

const element = ref<HTMLDivElement>();

const locked = computed(() => files.get(path) === "locked");

watchSettings(editorRef);

onMounted(() => {
    ensureMonacoEnvironment();
    const editor = monaco.editor.create(element.value!, {
        language: path.endsWith(".ts") ? "typescript" : "javascript",
        theme: "vs-dark",
        value: instance.text,
        readOnly: locked.value,
        automaticLayout: true
    });
    editor.onDidChangeModelContent(() => files.set(path, "modified"));
    editorRef.value = editor;
    instance.contents = () => editor!.getValue();
    window.addEventListener("resize", layout);
});

onUnmounted(() => {
    editorRef.value?.dispose();
    instance.contents = () => "";
    window.removeEventListener("resize", layout);
});

function layout() {
    editorRef.value?.layout({ width: 0, height: 0 });
}
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
    background-image: repeating-linear-gradient(135deg, transparent 1px, rgba(100, 100, 100, 0.1) 3px, transparent 5px, transparent 15px);
}
</style>
