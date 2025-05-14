<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";
import loop from "../game/main.ts";

const gameCanvas = ref<HTMLCanvasElement>();

const { renderer, game } = storeToRefs(useGameStore());

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

const dragging = ref(false);

function onMouseMove(event: MouseEvent) {
    if (!dragging.value)
        return;
    const position = game.value.position;
    position.x -= event.movementX;
    position.y -= event.movementY;
}
</script>

<template>
    <span class="view-label">Farm</span>
    <canvas ref="gameCanvas" id="gameCanvas" :class="{ dragging }"
            v-on:mousedown="dragging = true" v-on:mouseup="dragging = false" v-on:mousemove="onMouseMove"></canvas>
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
