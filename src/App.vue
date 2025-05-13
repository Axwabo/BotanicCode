<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import ProjectView from "./components/project/ProjectView.vue";
import Editor from "./components/editor/Editor.vue";
</script>

<template>
    <Suspense>
        <ProjectView/>
    </Suspense>
    <Suspense>
        <Editor/>
    </Suspense>
    <PWABadge/>
</template>

<style scoped></style>
