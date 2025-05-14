<script setup lang="ts">
import FarmCanvas from "./FarmCanvas.vue";
</script>

<template>
    <div class="farm-editor-container">
        <FarmCanvas/>
        <!--        TODO: toolbar-->
    </div>
</template>

<style scoped>
.farm-editor-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
}
</style>
