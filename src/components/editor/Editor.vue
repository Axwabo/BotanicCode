<script setup lang="ts">
import { ref, watch } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";

const { currentFile } = storeToRefs(useFileStore());
const { files } = useFileStore();

let controller = new AbortController();

const script = ref("");

const saving = ref(false);

async function saveChanges() {
    saving.value = true;
    try {
        const path = currentFile.value;
        const response = await fetch(path, {
            method: "POST",
            body: script.value
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
        script.value = "";
        return;
    }
    controller?.abort("Navigating file");
    controller = new AbortController();
    const response = await fetch(value, { signal: controller.signal });
    script.value = response.ok ? await response.text() : "";
});
</script>

<template>
    <textarea v-model="script"></textarea>
    <button v-on:click="saveChanges();" v-bind:disabled="saving">Save Changes</button>
</template>

<style scoped>

</style>
