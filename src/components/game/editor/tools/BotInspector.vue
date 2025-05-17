<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../../../../editorStore.ts";
import { computed, onMounted, onUnmounted } from "vue";
import { editorHandler } from "../../../../game/main.ts";
import type ClickEvent from "../../../../game/editor/clickEvent.ts";
import useGameStore from "../../../../gameStore.ts";
import { tileSize } from "../../../../util/tileConstants";

const { selectedBot } = storeToRefs(useEditorStore());

const { game } = useGameStore();

onMounted(() => editorHandler.addEventListener("click", handleClick));
onUnmounted(() => editorHandler.removeEventListener("click", handleClick));

const bot = computed(() => game.bots.get(selectedBot.value));

function handleClick(event: Event) {
    const { x, y } = <ClickEvent>event;
    for (const bot of game.bots.values()) {
        if (Math.pow(x - bot.position.x, 2) + Math.pow(y - bot.position.y, 2) > tileSize * tileSize)
            continue;
        selectedBot.value = bot.name;
        break;
    }
}
</script>

<template>
    <div v-if="selectedBot">
        <h2>{{ selectedBot }}</h2>
    </div>
    <p v-else>Click a bot to inspect it</p>
</template>

<style scoped>

</style>
