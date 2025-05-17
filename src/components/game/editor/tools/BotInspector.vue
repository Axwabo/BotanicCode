<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../../../../editorStore.ts";
import { computed, onMounted, onUnmounted } from "vue";
import { editorHandler } from "../../../../game/main.ts";
import type ClickEvent from "../../../../game/editor/clickEvent.ts";
import useGameStore from "../../../../gameStore.ts";
import { tileSize } from "../../../../util/tileConstants";
import { isInRange } from "../../../../util/distance";

const { selectedBot } = storeToRefs(useEditorStore());

const { game } = useGameStore();

const bot = computed(() => game.bots.get(selectedBot.value));

function handleClick(event: Event) {
    const { x, y } = <ClickEvent>event;
    for (const bot of game.bots.values()) {
        if (!isInRange(bot.position.x, bot.position.y, x, y, tileSize * 0.5))
            continue;
        selectedBot.value = bot.name;
        return;
    }
    selectedBot.value = "";
}

function terminateBot() {
    game.bots.delete(selectedBot.value);
    bot.value?.terminate();
    selectedBot.value = "";
}

onMounted(() => editorHandler.addEventListener("click", handleClick));
onUnmounted(() => editorHandler.removeEventListener("click", handleClick));
</script>

<template>
    <div v-if="selectedBot && bot" id="botInspector">
        <div class="details">
            <h2 class="bot-name">{{ selectedBot }}</h2>
            <span>X: {{ bot.position.x }} Y: {{ bot.position.y }}</span>
            <button v-on:click="terminateBot">Terminate</button>
        </div>
        <div class="bot-status">
            <p class="ready" v-if="bot.isReady">Ready</p>
            <p class="error" v-if="bot.error">{{ bot.error }}</p>
        </div>
    </div>
    <p v-else>Click a bot to inspect it</p>
</template>

<style scoped>
#botInspector {
    min-height: 0;
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 0.5rem;
}

.details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bot-name, .ready, .error {
    margin: 0;
}

.ready {
    color: #0f0;
}

.error {
    color: red;
    text-overflow: ellipsis;
}

.bot-status {
    min-height: 0;
    word-wrap: break-word;
    overflow-y: auto;
    scrollbar-gutter: stable;
    font-family: monospace;
}
</style>
