<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as monaco from "monaco-editor";
import useFileStore from "../../fileStore.ts"
import ensureMonacoEnvironment from "../../game/editor/environment.ts";

const { path } = defineProps<{ path: string; }>();

const { files, editors } = useFileStore();

const instance = editors.get(path)!;

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const element = ref<HTMLDivElement>();

onMounted(() => {
    ensureMonacoEnvironment();
    editor = monaco.editor.create(element.value!, {
        language: path.endsWith(".ts") ? "typescript" : "javascript",
        theme: "vs-dark",
        value: instance.text,
        readOnly: files.get(path) === "locked"
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
    <div id="monacoEditor" ref="element"></div>
</template>

<style scoped>
#monacoEditor {
    height: 100%;
}
</style>
