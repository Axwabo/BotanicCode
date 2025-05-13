<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as monaco from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { storeToRefs } from "pinia";
import useFileStore from "../../fileStore.ts";

self.MonacoEnvironment ??= {
    getWorker(_, label) {
        return label === "typescript" || label === "javascript" ? new tsWorker() : new editorWorker();
    }
};

const { fileContents, requestEditorText } = storeToRefs(useFileStore());

let editor: monaco.editor.IStandaloneCodeEditor | undefined;

const element = ref<HTMLDivElement>();

onMounted(() => {
    editor = monaco.editor.create(element.value!, {
        language: "javascript",
        theme: "vs-dark",
        value: fileContents.value
    });
    requestEditorText.value = () => editor!.getValue();
});

onUnmounted(() => {
    editor?.dispose();
    requestEditorText.value = () => "";
});
</script>

<template>
    <div id="monacoEditor" ref="element"></div>
</template>

<style scoped>
#monacoEditor {
    width: 1000px; /* TODO*/
    height: 500px;
}
</style>
