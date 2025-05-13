<script setup lang="ts">
import { ref } from "vue";
import useFileStore from "../../fileStore.ts";
import FileList from "./FileList.vue";

const { navigate } = useFileStore();

const newFile = ref("");

function createFile() {
    navigate(`bot/${newFile.value}`, "created");
    newFile.value = "";
}
</script>

<template>
    <span class="view-label">Project</span>
    <div id="projectContainer">
        <input type="text" v-model="newFile" placeholder="Create file">
        <button v-on:click="createFile()">+</button>
        <hr>
        <Suspense>
            <FileList/>
            <template #fallback>
                <p>Loading...</p>
            </template>
        </Suspense>
    </div>
</template>
