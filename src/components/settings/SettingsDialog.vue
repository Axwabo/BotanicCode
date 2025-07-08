<script setup lang="ts">
import { storeToRefs } from "pinia";
import useSettingsStore from "../../settingsStore.ts";

const store = useSettingsStore();

const { stickyScroll } = storeToRefs(store);

store.$subscribe(() => store.save());
</script>

<template>
    <h1>Settings</h1>
    <div>
        <input type="checkbox" id="stickyScroll" v-model="stickyScroll">
        <label for="stickyScroll">Sticky Scroll</label>
    </div>
</template>
