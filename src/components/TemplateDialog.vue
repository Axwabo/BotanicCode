<script setup lang="ts">
import { onMounted, ref } from "vue";
import useFileStore from "../fileStore.ts";

const { files } = useFileStore();

const dialogElement = ref<HTMLDialogElement>();

const key = "BotanicCodeTemplateDialogShown";
const dialogShown = ref(localStorage.getItem(key) === "true");
localStorage.setItem(key, "true");

onMounted(() => dialogElement.value?.showModal());

const loading = ref(false);

async function importExample() {
    loading.value = true;
    const response = await fetch(import.meta.env.BASE_URL + "/example.js");
    const text = await response.text();
    await fetch(import.meta.env.BASE_URL + "/bot/main.js", {
        method: "POST",
        body: text
    });
    files.set("/bot/main.js", "saved");
    dialogElement.value?.close();
}
</script>

<template>
    <dialog ref="dialogElement" v-if="!dialogShown" closedby="none">
        <h1>Botanic Code</h1>
        <p>Welcome!</p>
        <p>Would you like to import an example script?</p>
        <span v-if="loading">Importing...</span>
        <section v-else class="choices">
            <button v-on:click="importExample()">Yes</button>
            <button v-on:click="dialogElement!.close()">No</button>
        </section>
    </dialog>
</template>
