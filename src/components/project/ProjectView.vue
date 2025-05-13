<script setup lang="ts">
import { ref } from "vue";
import File from "./File.vue";
import { activeEditorFileName } from "../../activeEditor.ts";

const response = await fetch("file-list/bot");
const text = response.ok ? await response.text() : "";

const files = ref<string[]>(text.split("\n").filter(e => e));

const newFile = ref("");

function createFile() {
    activeEditorFileName.value = `bot/${newFile.value}`;
}
</script>

<template>
    <input type="text" v-model="newFile">
    <button v-on:click="createFile()">+</button>
    <ul>
        <li v-for="file in files">
            <File :filename="file"/>
        </li>
    </ul>
</template>

<style scoped>

</style>
