<script setup lang="ts">
import { storeToRefs } from "pinia";
import useSettingsStore from "../../settingsStore.ts";
import { useTutorialStore } from "../../tutorialStore.ts";

const emit = defineEmits<{ (e: "close"): void; }>();

const { restart } = useTutorialStore();

const store = useSettingsStore();

const { stickyScroll, minimap } = storeToRefs(store);

store.$subscribe(() => store.save());

function restartTutorial() {
    emit("close");
    restart();
}

function resetSettings() {
    store.reset();
}
</script>

<template>
    <h1>Settings</h1>
    <div>
        <input type="checkbox" id="stickyScroll" v-model="stickyScroll">
        <label for="stickyScroll">Sticky Scroll</label>
    </div>
    <div>
        <input type="checkbox" id="minimap" v-model="minimap">
        <label for="minimap">Editor Minimap</label>
    </div>
    <button v-on:click="restartTutorial">Restart Tutorial</button>
    <button v-on:click="resetSettings">Reset Settings</button>
    <button v-on:click="emit('close')" autofocus>Close</button>
</template>
