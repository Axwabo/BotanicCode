<script setup lang="ts">
import { ref, watch } from "vue";
import { activeEditorFileName } from "../../activeEditor.ts";

const script = ref("");

const saving = ref(false);

async function saveChanges() {
    saving.value = true;
    try {
        const response = await fetch(activeEditorFileName.value, {
            method: "POST",
            body: script.value
        });
        alert(response.status === 201 ? "Saved" : "Failed to save file");
    } finally {
        saving.value = false;
    }
}

watch(activeEditorFileName, async value => {
    const response = await fetch(value);
    script.value = response.ok ? await response.text() : "";
});
</script>

<template>
    <textarea v-model="script"></textarea>
    <button v-on:click="saveChanges();" v-bind:disabled="saving">Save Changes</button>
</template>

<style scoped>

</style>
