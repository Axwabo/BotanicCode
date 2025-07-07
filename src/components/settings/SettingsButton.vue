<script setup lang="ts">
import { ref } from "vue";
import SettingsDialog from "./SettingsDialog.vue";

const dialogElement = ref<HTMLDialogElement>();
</script>

<template>
    <button v-on:click="dialogElement?.showModal()">Settings</button>
    <dialog ref="dialogElement">
        <SettingsDialog/>
        <button v-on:click="dialogElement?.close()" autofocus>Close</button>
    </dialog>
</template>
