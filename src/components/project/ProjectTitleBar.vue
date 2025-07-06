<script setup lang="ts">
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";
import useFileStore from "../../fileStore.ts";

const { setSdkVisibility } = useFileStore();

function toggleHidden(event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    setSdkVisibility(checkbox.checked);
}
</script>

<template>
    <span class="view-label">Project</span>
    <div id="sdkToggleContainer">
        <label for="sdk">Show SDK</label>
        <input type="checkbox" id="sdk" v-on:change="toggleHidden">
    </div>
    <ConfirmDeleteDialog/>
</template>

