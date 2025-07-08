<script setup lang="ts">
import { ref } from "vue";
import useFileStore from "../../fileStore.ts";
import { useTutorialStore } from "../../tutorialStore.ts";

const { save, navigate } = useFileStore();

const { skip } = useTutorialStore();

const loading = ref(false);

const file = "/bot/main.js";

async function importExample() {
    loading.value = true;
    const response = await fetch(import.meta.env.BASE_URL + "example.js");
    const text = await response.text();
    await save(file, text);
    skip();
    navigate(file);
}

</script>

<template>
    <h1>End of Tutorial</h1>
    <p>That's all you need to know!</p>
    <p>Would you like to import an example script?</p><span v-if="loading">Importing...</span>
    <section v-else class="choices">
        <button v-on:click="importExample()">Yes</button>
        <button v-on:click="skip">No</button>
    </section>
</template>
