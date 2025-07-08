<script setup lang="ts">
import { ref } from "vue";
import SettingsDialog from "./SettingsDialog.vue";

const dialogElement = ref<HTMLDialogElement>();
</script>

<template>
    <button v-on:click="dialogElement?.showModal()">Settings</button>
    <dialog ref="dialogElement" class="settings-dialog">
        <SettingsDialog v-on:close="dialogElement?.close()"/>
    </dialog>
</template>


<style scoped>
.settings-dialog {
    flex-direction: column;
    gap: 0.5rem;
}

.settings-dialog[open] {
    display: flex;
}
</style>
