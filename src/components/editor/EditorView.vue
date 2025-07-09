<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import Loading from "./Loading.vue";
import EditorList from "./EditorList.vue";
import EditorTitleBar from "./EditorTitleBar.vue";
import { tutorialSequence } from "../../tutorialStore.ts";

const { currentFile } = storeToRefs(useFileStore());
const { cycleTabs, navigate, editors, files, get, restoreEditors } = useFileStore();

const sequence = tutorialSequence();

const monaco = defineAsyncComponent({
    delay: 0,
    loadingComponent: Loading,
    loader: () => import("./MonacoEditor.vue")
});

watch(currentFile, async value => {
    if (!value)
        return;
    if (editors.get(value)) {
        navigate(value);
        return;
    }
    const contents = await get(value);
    navigate(value, contents);
}, { immediate: true });

onMounted(() => {
    restoreEditors();
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener("beforeunload", handleUnload);
    window.addEventListener("keydown", handleKeyDown);
});

function handleUnload(event: BeforeUnloadEvent) {
    if (!currentFile.value)
        return;
    const state = files.get(currentFile.value);
    if (state === "created" || state === "modified")
        event.preventDefault();
}

function handleKeyDown(event: KeyboardEvent) {
    if (!event.ctrlKey || !event.altKey)
        return;
    if (event.key === "ArrowRight")
        cycleTabs(1);
    else if (event.key === "ArrowLeft")
        cycleTabs(-1);
}
</script>

<template>
    <div :class="{ 'view-title-bar': true, outline: sequence === 'run' }">
        <EditorTitleBar/>
    </div>
    <div id="editorContainer">
        <EditorList/>
        <div id="currentEditor" :class="{ outline: sequence === 'editor' }">
            <monaco v-if="editors.size" v-for="file in editors.keys()" v-show="file === currentFile" :key="file" :path="file"/>
            <p v-else>Click on a file to open it, or create a new one</p>
        </div>
    </div>
</template>

<style scoped>
#editorContainer {
    min-height: 20rem;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
}

#currentEditor:has(> p) {
    display: grid;
    place-items: center;
}
</style>
