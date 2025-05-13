<script setup lang="ts">
const { filename } = defineProps<{ filename: string; }>();
</script>

<template>
<button>{{ filename }}</button>
</template>

<style scoped>

</style>
