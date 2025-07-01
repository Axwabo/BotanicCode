<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import useFileStore from "../../fileStore.ts";

const caching = ref(false);
const hidden = ref(false);

const channel = new BroadcastChannel("BotanicCodePrecache");

channel.addEventListener("message", handlePrecaching);

const { init } = useFileStore();

const { swActivated } = storeToRefs(useFileStore());

function handlePrecaching(ev: MessageEvent) {
    if (ev.data?.type === "precaching")
        caching.value = true;
}

watch(swActivated, value => {
    if (caching.value && value)
        init();
});
</script>

<template>
    <div id="precacheProgress" v-if="caching && !hidden">
        <div>
            <button v-on:click="hidden = true" class="close">X</button>
            <span v-if="swActivated">Precaching completed</span>
            <span v-else>Precaching...</span>
        </div>
        <progress :value="swActivated ? 1 : undefined" class="progressbar"></progress>
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
