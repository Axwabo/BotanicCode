<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../../../../editorStore.ts";
import { computed, onMounted, onUnmounted } from "vue";
import type ClickEvent from "../../../../game/events/clickEvent.ts";
import useGameStore from "../../../../gameStore.ts";
import { tileSize } from "../../../../util/tileConstants";
import { isInRange } from "../../../../util/distance";
import { editorHandler } from "../../../../game/events/editorHandler.ts";
import TerminatingBotEvent from "../../../../game/events/terminatingBotEvent.ts";

const { selectedBot } = storeToRefs(useEditorStore());

const { game } = useGameStore();

const { workerReady, workerError } = storeToRefs(useGameStore());

const bot = computed(() => game.botManager.bots.get(selectedBot.value));

function handleClick(event: ClickEvent) {
    const { x, y } = event;
    for (const [ name, position ] of game.botManager.bots) {
        if (!isInRange(position.x, position.y, x, y, tileSize * 0.5))
            continue;
        selectedBot.value = name;
        return;
    }
    selectedBot.value = "";
}

function terminateBot() {
    editorHandler.dispatchEvent(new TerminatingBotEvent(selectedBot.value));
}

onMounted(() => editorHandler.addEventListener("click", handleClick));
onUnmounted(() => editorHandler.removeEventListener("click", handleClick));
</script>

<template>
    <div id="botInspector">
        <div v-if="selectedBot && bot" class="details">
            <h2 class="bot-name">{{ selectedBot }}</h2>
            <span>X: {{ bot.x }} Y: {{ bot.y }}</span>
            <button v-on:click="terminateBot">Terminate</button>
        </div>
        <p v-else>Click a bot to inspect</p>
        <div class="bot-status">
            <p class="ready" v-if="workerReady">Ready</p>
            <pre class="error" v-if="workerError">{{ workerError instanceof Error ? workerError.stack : workerError }}</pre>
        </div>
    </div>
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
