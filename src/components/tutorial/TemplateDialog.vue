<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Example from "./Example.vue";
import { storeToRefs } from "pinia";
import useTutorialStore from "../../tutorialStore.ts";

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
        <button v-on:click="sequence = 'skip'">Skip Tutorial</button>
        <Example v-if="sequence === 'example'"/>
    </dialog>
</template>
