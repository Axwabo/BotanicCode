<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Example from "./Example.vue";
import { tutorialSequence } from "../../tutorialStore.ts";
import Welcome from "./Welcome.vue";
import Project from "./Project.vue";
import Navigation from "./Navigation.vue";
import SDK from "./SDK.vue";
import Editor from "./Editor.vue";
import Tabs from "./Tabs.vue";
import Run from "./Run.vue";
import Board from "./Board.vue";
import FarmActions from "./FarmActions.vue";
import Tools from "./Tools.vue";
import Environment from "./Environment.vue";

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
    const outlined = document.querySelector(".outline");
    if (!outlined)
        return;
    outlined.scrollIntoView();
});
</script>

<template>
    <dialog ref="dialogElement" closedby="none" v-on:close="complete">
        <Welcome v-if="sequence === 'welcome'"/>
        <Project v-else-if="sequence === 'project'"/>
        <SDK v-else-if="sequence === 'sdk'"/>
        <Editor v-else-if="sequence === 'editor'"/>
        <Tabs v-else-if="sequence === 'tabs'"/>
        <Run v-else-if="sequence === 'run'"/>
        <Board v-else-if="sequence === 'board'"/>
        <FarmActions v-else-if="sequence === 'actions'"/>
        <Tools v-else-if="sequence === 'tools'"/>
        <Environment v-else-if="sequence === 'environment'"/>
        <Example v-if="sequence === 'example'"/>
        <Navigation v-else/>
    </dialog>
</template>

<style scoped>
:deep(h1) {
    margin-top: 0;
}

:deep(code) {
    background-color: black;
    padding: 0.25em;
}
</style>
