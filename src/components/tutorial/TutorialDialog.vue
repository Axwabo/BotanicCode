<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Example from "./Example.vue";
import tutorialSequence from "../../tutorialStore.ts";
import Welcome from "./Welcome.vue";
import Project from "./Project.vue";
import Navigation from "./Navigation.vue";

const sequence = tutorialSequence();

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
        <Project v-if="sequence === 'project'"/>
        <Example v-if="sequence === 'example'"/>
        <Navigation v-else/>
    </dialog>
</template>
