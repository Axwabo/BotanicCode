<script setup lang="ts">
import { ref } from "vue";
import useFileStore from "../../fileStore.ts";
import FileList from "./FileList.vue";
import useGameStore from "../../gameStore.ts";
import Bot from "../../game/bot.ts";

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

function run() {
    const { currentFile } = useFileStore();
    const { game } = useGameStore();
    const name = Date.now().toString(32);
    game.bots.set(name, new Bot(name, currentFile));
}
</script>

<template>
    <div class="view-title-bar">
        <span class="view-label">Project</span>
        <button v-on:click="run()">Run</button>
    </div>
    <div id="projectContainer">
        <div class="create-container">
            <input type="text" v-model="newFile" placeholder="Create file" :pattern="filenamePattern">
            <button v-on:click="createFile()">+</button>
        </div>
        <hr>
        <Suspense>
            <FileList/>
            <template #fallback>
                <p>Loading...</p>
            </template>
        </Suspense>
    </div>
</template>

<style scoped>
.create-container {
    display: flex;
    gap: 0.25rem;
}

.create-container input:invalid {
    color: #f55;
}
</style>
