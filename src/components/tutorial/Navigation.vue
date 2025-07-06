<script setup lang="ts">
import useTutorialStore from "../../tutorialStore.ts";

const { next, skip } = useTutorialStore();
</script>

<template>
    <section class="choices">
        <button autofocus v-on:click="next">Next</button>
        <button v-on:click="skip">Skip Tutorial</button>
    </section>
</template>
