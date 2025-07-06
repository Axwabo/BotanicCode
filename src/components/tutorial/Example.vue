<script setup lang="ts">
import { ref } from "vue";
import useFileStore from "../../fileStore.ts";
import useTutorialStore from "../../tutorialStore.ts";

const { save } = useFileStore();

const { skip } = useTutorialStore();

const loading = ref(false);

async function importExample() {
    loading.value = true;
    const response = await fetch(import.meta.env.BASE_URL + "example.js");
    const text = await response.text();
    await save("/bot/main.js", text);
    skip();
}

</script>

<template>
    <h1>Botanic Code</h1>
    <p>Welcome!</p>
    <p>Would you like to import an example script?</p><span v-if="loading">Importing...</span>
    <section v-else class="choices">
        <button v-on:click="importExample()">Yes</button>
        <button v-on:click="skip">No</button>
    </section>
</template>
