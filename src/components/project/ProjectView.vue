<script setup lang="ts">
import { ref } from "vue";
import useFileStore from "../../fileStore.ts";
import FileList from "./FileList.vue";
import ProjectTitleBar from "./ProjectTitleBar.vue";
import PrecacheProgress from "./PrecacheProgress.vue";

const { navigate } = useFileStore();

const newFile = ref("");

const filenamePattern = "[A-z0-9_\\/\\-]+";

const filenameRegex = new RegExp(`^${filenamePattern}?$`);

function createFile() {
    if (!newFile.value.match(filenameRegex))
        return;
    navigate(`/bot/${newFile.value}.js`);
    newFile.value = "";
}
</script>

<template>
    <div class="view-title-bar">
        <ProjectTitleBar/>
    </div>
    <div id="projectContainer">
        <div class="create-container">
            <input type="text" v-model="newFile" placeholder="Create file" :pattern="filenamePattern">
            <button v-on:click="createFile()">+</button>
        </div>
        <Suspense>
            <FileList/>
            <template #fallback>
                <p>Loading...</p>
            </template>
        </Suspense>
        <PrecacheProgress/>
    </div>
</template>

<style scoped>
#projectContainer {
    display: grid;
    grid-template-rows: auto 1fr auto;
}

.create-container {
    display: flex;
    gap: 0.25rem;
}

.create-container input:invalid {
    color: #f55;
}
</style>
