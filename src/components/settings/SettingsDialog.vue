<script setup lang="ts">
import { storeToRefs } from "pinia";
import useSettingsStore from "../../settingsStore.ts";
import { useTutorialStore } from "../../tutorialStore.ts";

const emit = defineEmits<{ (e: "close"): void; }>();

const { restart } = useTutorialStore();

const store = useSettingsStore();

const { stickyScroll } = storeToRefs(store);

store.$subscribe(() => store.save());

function restartTutorial() {
    emit("close");
    restart();
}
</script>

<template>
    <h1>Settings</h1>
    <div>
        <input type="checkbox" id="stickyScroll" v-model="stickyScroll">
        <label for="stickyScroll">Sticky Scroll</label>
    </div>
    <button v-on:click="restartTutorial">Restart Tutorial</button>
    <button v-on:click="emit('close')" autofocus>Close</button>
</template>
