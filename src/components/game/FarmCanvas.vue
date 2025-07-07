<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import loop from "../../game/main.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../../gameStore.ts";
import isTutorialSequence from "../../tutorialStore.ts";

const { renderer, dragging } = storeToRefs(useGameStore());

const outline = isTutorialSequence("board");

const gameCanvas = ref<HTMLCanvasElement>();

function layout() {
    const canvas = gameCanvas.value!;
    canvas.style.removeProperty("width");
    canvas.style.removeProperty("height");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    return canvas;
}

onMounted(() => {
    const canvas = layout();
    renderer.value = {
        canvas,
        context: canvas.getContext("2d")!
    };
    requestAnimationFrame(loop);
    window.addEventListener("resize", layout);
});

onUnmounted(() => window.removeEventListener("resize", layout));
</script>

<template>
    <canvas id="gameCanvas" ref="gameCanvas" :class="{ dragging, outline }"></canvas>
</template>

<style scoped>
#gameCanvas {
    width: 100%;
    height: 100%;
    min-height: 20rem;
    touch-action: none;
}

#gameCanvas.dragging {
    cursor: move;
}
</style>
