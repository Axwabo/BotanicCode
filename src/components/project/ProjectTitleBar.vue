<script setup lang="ts">
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";
import useFileStore from "../../fileStore.ts";
import isTutorialSequence from "../../tutorialStore.ts";

const { setSdkVisibility } = useFileStore();

const outline = isTutorialSequence("sdk");

function toggleHidden(event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    setSdkVisibility(checkbox.checked);
}
</script>

<template>
    <span class="view-label">Project</span>
    <div :class="{ outline }">
        <label for="sdk">Show SDK</label>
        <input type="checkbox" id="sdk" v-on:change="toggleHidden">
    </div>
    <ConfirmDeleteDialog/>
</template>

