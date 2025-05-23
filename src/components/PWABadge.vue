<script setup lang="ts">
import { computed } from "vue"
import { useRegisterSW } from "virtual:pwa-register/vue"
import { storeToRefs } from "pinia";
import useFileStore from "../fileStore.ts";

// check for updates every hour
const period = 60 * 60 * 1000;

const { swActivated } = storeToRefs(useFileStore());

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
    if (period <= 0) return;

    setInterval(async () => {
        if ("onLine" in navigator && !navigator.onLine)
            return;

        const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
                "cache": "no-store",
                "cache-control": "no-cache"
            }
        });

        if (resp?.status === 200)
            await r.update();
    }, period);
}

const { needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
        if (period <= 0) return;
        if (r?.active?.state === "activated") {
            swActivated.value = true;
            registerPeriodicSync(swUrl, r);
        } else if (r?.installing) {
            r.installing.addEventListener("statechange", (e) => {
                const sw = e.target as ServiceWorker;
                swActivated.value = sw.state === "activated";
                if (swActivated.value)
                    registerPeriodicSync(swUrl, r);
            });
        }
    }
});

const title = computed(() => needRefresh.value ? "New content available. Click the reload button to update." : "");

function close() {
    needRefresh.value = false;
}
</script>

<template>
    <div
        v-if="needRefresh"
        class="pwa-toast"
        aria-labelledby="toast-message"
        role="alert"
    >
        <div class="message">
      <span id="toast-message">
        {{ title }}
      </span>
        </div>
        <div class="buttons">
            <button type="button" class="reload" @click="updateServiceWorker()">
                Reload
            </button>
            <button type="button" @click="close">
                Close
            </button>
        </div>
    </div>
</template>

<style scoped>
.pwa-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    display: grid;
    background-color: #111;
}

.pwa-toast .message {
    margin-bottom: 8px;
}

.pwa-toast .buttons {
    display: flex;
}

.pwa-toast button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
}

.pwa-toast button.reload {
    display: block;
}
</style>
