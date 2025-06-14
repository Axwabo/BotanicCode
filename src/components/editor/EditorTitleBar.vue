<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import useFileStore from "../../fileStore.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../../gameStore.ts";
import BotManager from "../../game/botManager.ts";
import type ManagedBoard from "../../game/managedBoard.ts";

const { files, editors, save } = useFileStore();

const { currentFile, canRun } = storeToRefs(useFileStore());

const { game } = useGameStore();

const { workerReady } = storeToRefs(useGameStore());

const saving = ref(false);

const canSave = computed(() => {
    const status = files.get(currentFile.value);
    return !saving.value && (status === "modified" || status === "created");
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

function stop() {
    game.botManager.terminate();
    workerReady.value = false;
}

function run() {
    stop();
    game.botManager = new BotManager(<ManagedBoard>game.board, currentFile.value, game.botManager);
}

onMounted(() => window.addEventListener("keydown", handleSave));
onUnmounted(() => window.removeEventListener("keydown", handleSave));
</script>

<template>
    <span class="view-label">Editor</span>
    <button v-on:click="saveChanges" v-bind:disabled="!canSave">Save Changes</button>
    <button v-on:click="run" v-bind:disabled="!canRun">Run</button>
    <button v-on:click="stop" v-bind:disabled="!workerReady">Stop</button>
</template>
