<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import Loading from "./Loading.vue";

const { currentFile, fileContents, requestEditorText } = storeToRefs(useFileStore());
const { files } = useFileStore();

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
        const path = currentFile.value;
        const response = await fetch(path, {
            method: "POST",
            body: requestEditorText.value()
        });
        if (response.status !== 201) {
            alert("Failed to save file");
            return;
        }
        files.set(path, "saved");
        alert("Saved");
    } finally {
        saving.value = false;
    }
}

watch(currentFile, async value => {
    if (!value)
        return;
    if (files.get(value) === "created") {
        fileContents.value = "";
        loadedFile.value = value;
        return;
    }
    controller?.abort("Navigating file");
    controller = new AbortController();
    const response = await fetch(value, { signal: controller.signal });
    fileContents.value = response.ok ? await response.text() : "";
    loadedFile.value = value;
});
</script>

<template>
    <monaco :key="loadedFile"/>
    <button v-on:click="saveChanges();" v-bind:disabled="saving">Save Changes</button>
</template>

<style scoped>

</style>
