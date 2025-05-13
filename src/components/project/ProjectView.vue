<script setup lang="ts">
import { ref } from "vue";
import File from "./File.vue";

const response = await fetch("file-list/bot");
const text = await response.text();

const files = ref<string[]>(text.split("\n").filter(e => e));

const newFile = ref("");

async function createFile() {
    const response=await fetch(`bot/${newFile.value}`, {
        method: "POST",
        body: ""
    });
    if(response.ok)
        files.value = files.value.concat(await response.text());
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
