<script setup lang="ts">
import { onMounted, ref } from "vue";
import loop from "../../game/main.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../../gameStore.ts";

const { renderer, dragging } = storeToRefs(useGameStore());

const gameCanvas = ref<HTMLCanvasElement>();

onMounted(() => {
    const canvas = gameCanvas.value!;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    renderer.value = {
        canvas,
        context: canvas.getContext("2d")!
    };
    requestAnimationFrame(loop);
});
</script>

<template>
    <canvas id="gameCanvas" ref="gameCanvas" :class="{ dragging }"></canvas>
</template>

<style scoped>
#gameCanvas {
    width: 100%;
    height: 100%;
}

#gameCanvas.dragging {
    cursor: move;
}
</style>
