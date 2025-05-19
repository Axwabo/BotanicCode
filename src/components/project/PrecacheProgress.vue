<script setup lang="ts">
import { ref } from "vue";

const total = ref(0);
const current = ref(0);
const hidden = ref(false);

const channel = new BroadcastChannel("BotanicCodePrecache");

channel.addEventListener("message", handlePrecaching);

function handlePrecaching(ev: MessageEvent) {
    if (ev.data?.type !== "precaching")
        return;
    current.value = ev.data.current;
    if (ev.data.total)
        total.value = ev.data.total;
}
</script>

<template>
    <div id="precacheProgress" v-if="total && !hidden">
        <div>
            <button v-on:click="hidden = true" class="close">X</button>
            <span v-if="current === total">Precaching completed</span>
            <span v-else>Precaching: {{ current }}/{{ total }}</span>
        </div>
        <progress :value="current" :max="total" class="progressbar"></progress>
    </div>
</template>

<style scoped>
#precacheProgress {
    display: flex;
    justify-content: stretch;
    flex-direction: column;
    gap: 0.25rem;
}

.progressbar {
    width: 100%;
}

.close {
    margin-right: 0.5rem;
}
</style>
