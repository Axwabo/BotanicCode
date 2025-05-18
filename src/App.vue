<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import { defineAsyncComponent, ref } from "vue";
import Loading from "./components/Loading.vue";

const page = defineAsyncComponent({
    delay: 0,
    loader: () => import("./Page.vue"),
    loadingComponent: Loading
});

const activated = ref(false);
</script>

<template>
    <PWABadge v-on:activated="activated = true"/>
    <page v-if="activated"/>
    <Loading v-else/>
</template>
