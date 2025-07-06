<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Example from "./Example.vue";
import { storeToRefs } from "pinia";
import useTutorialStore from "../../tutorialStore.ts";
import Welcome from "./Welcome.vue";

const { sequence } = storeToRefs(useTutorialStore());

const dialogElement = ref<HTMLDialogElement>();

const key = "BotanicCodeTutorialCompleted";

onMounted(() => {
    if (localStorage.getItem(key) !== "true")
        dialogElement.value!.showModal();
});

function complete() {
    localStorage.setItem(key, "true");
}

watch(sequence, value => {
    if (value === "skip")
        dialogElement.value?.close();
});
</script>

<template>
    <dialog ref="dialogElement" closedby="none" v-on:close="complete">
        <Welcome v-if="sequence === 'welcome'"/>
        <Example v-if="sequence === 'example'"/>
    </dialog>
</template>
