<script setup lang="ts">
import { defineAsyncComponent, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import Loading from "./Loading.vue";
import EditorList from "./EditorList.vue";
import EditorTitleBar from "./EditorTitleBar.vue";
import isTutorialSequence from "../../tutorialStore.ts";

const { currentFile } = storeToRefs(useFileStore());
const { navigate, editors, get } = useFileStore();

const outline = isTutorialSequence("editor");

const monaco = defineAsyncComponent({
    delay: 0,
    loadingComponent: Loading,
    loader: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await import("./MonacoEditor.vue");
    }
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
</script>

<template>
    <div class="view-title-bar">
        <EditorTitleBar/>
    </div>
    <div id="editorContainer">
        <EditorList/>
        <div id="currentEditor" :class="{ outline }">
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
