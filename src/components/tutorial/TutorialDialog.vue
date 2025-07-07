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
    const dialog = dialogElement.value!;
    if (value === "skip")
        dialog.close();
    const outlined = document.querySelector<HTMLElement>(".outline");
    if (!outlined)
        return;
    dialog.style.removeProperty("margin-top");
    dialog.style.removeProperty("margin-bottom");
    outlined.scrollIntoView();
    const dialogRect = dialog.getBoundingClientRect();
    const outlinedRect = outlined.getBoundingClientRect();
    if (outlinedRect.bottom > dialogRect.top && outlinedRect.bottom < dialogRect.bottom)
        dialog.style.marginTop = `${outlinedRect.bottom + 10}px`;
    else if (outlinedRect.top < dialogRect.bottom && outlinedRect.top > dialogRect.top)
        dialog.style.marginBottom = `${outlinedRect.top + 10}px`;
}, { flush: "post" });
</script>

<template>
    <dialog ref="dialogElement" v-on:close="complete">
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
