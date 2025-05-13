<script setup lang="ts">
import { ref } from "vue";
import File from "./File.vue";
import useFileStore from "../../fileStore.ts";

const { files, navigate } = useFileStore();

const response = await fetch("file-list/bot");
if (response.ok) {
    const text = await response.text();
    const lines = text.split("\n");
    for (const line of lines)
        if (line)
            files.set(line, "saved");
}

const newFile = ref("");

function createFile() {
    navigate(`bot/${newFile.value}`, "created");
}
</script>

<template>
    <input type="text" v-model="newFile">
    <button v-on:click="createFile()">+</button>
    <ul>
        <li v-for="[file, status] in files">
            <File :filename="file" :status="status"/>
        </li>
    </ul>
</template>

<style scoped>

</style>
