<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";

const gameCanvas = ref<HTMLCanvasElement>();

const { renderer } = storeToRefs(useGameStore());

onMounted(() => {
    const canvas = gameCanvas.value!;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    return renderer.value = {
        canvas,
        context: canvas.getContext("2d")!
    };
});
</script>

<template>
    <span class="view-label">Farm</span>
    <canvas ref="gameCanvas" id="gameCanvas"></canvas>
</template>

<style scoped>
#gameCanvas {
    width: 100%;
    height: 100%;
}
</style>
