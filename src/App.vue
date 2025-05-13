<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import ProjectView from "./components/project/ProjectView.vue";
import EditorView from "./components/editor/EditorView.vue";
</script>

<template>
    <Suspense>
        <ProjectView/>
    </Suspense>
    <EditorView/>
    <PWABadge/>
</template>

<style scoped></style>
