<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";
import loop from "../game/main.ts";
import { tileSize, type TileType } from "../game/tileConstants.ts";

const gameCanvas = ref<HTMLCanvasElement>();

const { renderer, game } = storeToRefs(useGameStore());

function assignRenderer(canvas: HTMLCanvasElement) {
    renderer.value = {
        canvas,
        context: canvas.getContext("2d")!
    };
}

onMounted(() => {
    const canvas = gameCanvas.value!;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    assignRenderer(canvas);
    requestAnimationFrame(loop);
});

const dragging = ref(false);

const tileToPlace = ref<TileType>("gravel");

function onMouseDown(event: MouseEvent) {
    if (event.button === 1) {
        dragging.value = true;
        return;
    }
    const canvas = gameCanvas.value!;
    const pos = game.value.position;
    const x = event.offsetX - canvas.width * 0.5 + pos.x;
    const y = event.offsetY - canvas.height * 0.5 + pos.y;
    const tile = game.value.board.getTile(Math.floor(x / tileSize), Math.floor(y / tileSize));
    tile.type = tileToPlace.value;
}

function onMouseMove(event: MouseEvent) {
    if (!dragging.value)
        return;
    const position = game.value.position;
    position.x -= event.movementX;
    position.y -= event.movementY;
}

function resetPosition() {
    const position = game.value.position;
    position.x = 0;
    position.y = 0;
}

function reset() {
    useGameStore().$reset();
    assignRenderer(gameCanvas.value!);
}
</script>

<template>
    <div class="game-buttons">
        <span class="view-label">Farm</span>
        <select v-model="tileToPlace">
            <option>grass</option>
            <option>air</option>
            <option>gravel</option>
            <option>dirt</option>
        </select>
        <button v-on:click="resetPosition">Back to (0, 0)</button>
        <button v-on:click="reset">Reset</button>
    </div>
    <canvas ref="gameCanvas" id="gameCanvas" :class="{ dragging }"
            v-on:mousedown="onMouseDown" v-on:mouseup="dragging = false" v-on:mousemove="onMouseMove"></canvas>
</template>

<style scoped>
.game-buttons {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

#gameCanvas {
    width: 100%;
    height: 100%;
}

#gameCanvas.dragging {
    cursor: move;
}
</style>
