<script setup lang="ts">
import FarmCanvas from "./FarmCanvas.vue";
import FarmToolbar from "./editor/FarmToolbar.vue";
</script>

<template>
    <div class="farm-editor-container">
        <FarmCanvas/>
        <FarmToolbar/>
    </div>
</template>

<style scoped>
.farm-editor-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 0.5rem;
}
</style>
