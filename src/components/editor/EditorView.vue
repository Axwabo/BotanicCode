<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import Loading from "./Loading.vue";
import EditorList from "./EditorList.vue";

const { currentFile } = storeToRefs(useFileStore());
const { navigate, editors, get, save } = useFileStore();

const saving = ref(false);

const monaco = defineAsyncComponent({
    delay: 0,
    loadingComponent: Loading,
    loader: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await import("./MonacoEditor.vue");
    }
});

async function saveChanges() {
    saving.value = true;
    try {
        const path = currentFile.value;
        await save(path, editors.get(path)!.contents());
    } finally {
        saving.value = false;
    }
}

function handleSave(event: KeyboardEvent) {
    if (!event.ctrlKey || event.key !== "s")
        return;
    saveChanges();
    event.preventDefault();
}

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
        <span class="view-label">Editor</span>
        <button v-on:click="saveChanges();" v-bind:disabled="saving">Save Changes</button>
    </div>
    <div id="editorContainer" v-on:keydown="handleSave">
        <EditorList/>
        <div id="currentEditor">
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
