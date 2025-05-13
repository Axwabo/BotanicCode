<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import ProjectView from "./components/project/ProjectView.vue";
</script>

<template>
    <Suspense>
        <ProjectView/>
    </Suspense>
    <PWABadge/>
</template>

<style scoped></style>
