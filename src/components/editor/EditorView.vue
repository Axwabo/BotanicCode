<script setup lang="ts">
import { computed, defineAsyncComponent, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import Loading from "./Loading.vue";
import EditorList from "./EditorList.vue";
import EditorTitleBar from "./EditorTitleBar.vue";
import { tutorialSequence } from "../../tutorialStore.ts";

const { currentFile } = storeToRefs(useFileStore());
const { navigate, editors, get } = useFileStore();

const sequence = tutorialSequence();

const monaco = defineAsyncComponent({
    delay: 0,
    loadingComponent: Loading,
    loader: async () => {

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

const editorComponents = computed(() => {
    const components = [];
    for (const instance of editors.values()) {
        const component = defineAsyncComponent({
            delay: 0,
            loadingComponent: Loading,
            loader: async () => {
                instance.loadTriggered = true;
                await Promise.all(Array.from(editors.values()).filter(e => !e.loadTriggered).map(e => e.loading));
                return await import("./MonacoEditor.vue");
            }
        });
        components.push([ instance.file, component ]);
    }
    return components;
});
</script>

<template>
    <div :class="{ 'view-title-bar': true, outline: sequence === 'run' }">
        <EditorTitleBar/>
    </div>
    <div id="editorContainer">
        <EditorList/>
        <div id="currentEditor" :class="{ outline: sequence === 'editor' }">
            <component v-if="editorComponents.length" v-for="[file, editorComponent] in editorComponents" v-show="file === currentFile"
                       :is="editorComponent" :key="file" :path="file"/>
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
