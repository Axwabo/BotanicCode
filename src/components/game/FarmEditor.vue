<script setup lang="ts">
import FarmToolbar from "./editor/FarmToolbar.vue";
import { defineAsyncComponent } from "vue";
import Loading from "./Loading.vue";

const farmCanvas = defineAsyncComponent({
    delay: 0,
    loader: () => import("./FarmCanvas.vue"),
    loadingComponent: Loading
});
</script>

<template>
    <div class="farm-editor-container">
        <farmCanvas/>
        <FarmToolbar/>
    </div>
</template>

<style scoped>
.farm-editor-container {
    width: 100%;
    min-height: 0;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 0.5rem;
}
</style>
