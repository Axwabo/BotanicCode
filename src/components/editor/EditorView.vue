<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import Loading from "./Loading.vue";

const { currentFile } = storeToRefs(useFileStore());
const { navigate, files, editors } = useFileStore();

let controller = new AbortController();

const saving = ref(false);

const loadedFile = ref("");

const monaco = defineAsyncComponent({
    delay: 0,
    loadingComponent: Loading,
    loader: () => import("./MonacoEditor.vue")
});

async function saveChanges() {
    saving.value = true;
    try {
        const path = loadedFile.value;
        const body = editors.get(loadedFile.value)!.contents();
        const response = await fetch(path, {
            method: "POST",
            body
        });
        if (response.status !== 201)
            alert("Failed to save file");
        else
            files.set(path, "saved");
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
    if (files.get(value) === "created") {
        loadedFile.value = value;
        return;
    }
    controller?.abort("Navigating file");
    controller = new AbortController();
    const response = await fetch(value, { signal: controller.signal });
    const contents = response.ok ? await response.text() : "";
    navigate(value, contents);
    loadedFile.value = value;
}, { immediate: true });
</script>

<template>
    <div class="view-title-bar">
        <span class="view-label">{{ loadedFile || "Editor" }}</span>
        <button v-on:click="saveChanges();" v-bind:disabled="saving">Save Changes</button>
    </div>
    <div id="editorContainer" v-on:keydown="handleSave">
        <monaco v-if="editors.size" v-for="{file} in editors.values()" v-show="file === currentFile" :key="file" :path="file"/>
        <p v-else>Click on a file to open it, or create a new one</p>
    </div>
</template>

<style scoped>
#editorContainer {
    min-height: 20rem;
    height: calc(100% - 0.5rem);
}

#editorContainer:has(> p) {
    display: grid;
    place-items: center;
    background-color: #1e1e1e;
}
</style>
