<script setup lang="ts">
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";
import useFileStore from "../../fileStore.ts";
import tutorialSequence from "../../tutorialStore.ts";

const { setSdkVisibility } = useFileStore();

const sequence = tutorialSequence();

function toggleHidden(event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    setSdkVisibility(checkbox.checked);
}
</script>

<template>
    <span class="view-label">Project</span>
    <div :class="{ outline: sequence === 'sdk' }">
        <label for="sdk">Show SDK</label>
        <input type="checkbox" id="sdk" v-on:change="toggleHidden">
    </div>
    <ConfirmDeleteDialog/>
</template>

