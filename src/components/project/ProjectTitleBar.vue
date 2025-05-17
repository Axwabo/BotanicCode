<script setup lang="ts">
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";
import useFileStore from "../../fileStore.ts";
import useGameStore from "../../gameStore.ts";
import BotManager from "../../game/botManager.ts";
import { storeToRefs } from "pinia";

const { setSdkVisibility } = useFileStore();

const { currentFile, canRun } = storeToRefs(useFileStore());

const { game } = useGameStore();

function run() {
    const name = Date.now().toString(32);
    game.bots.set(name, new BotManager(name, currentFile.value));
}

function toggleHidden(event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    setSdkVisibility(checkbox.checked);
}
</script>

<template>
    <span class="view-label">Project</span>
    <div>
        <label for="sdk">Show SDK</label>
        <input type="checkbox" id="sdk" checked v-on:change="toggleHidden">
    </div>
    <button v-on:click="run()" v-bind:disabled="!canRun">Run</button>
    <ConfirmDeleteDialog/>
</template>

