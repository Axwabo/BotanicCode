<script setup lang="ts">
import type { Facing } from "../../../../game/tileData.ts";
import useEditorStore from "../../../../editorStore.ts";
import { ref, watch } from "vue";

const { facings } = useEditorStore();

const { facing } = defineProps<{ facing: Facing; }>();

const selected = ref(facings.has(facing));

watch(selected, value => {
    if (value)
        facings.add(facing);
    else
        facings.delete(facing);
});
</script>

<template>
    <input type="checkbox" :id="facing" v-model="selected">
    <label :for="facing">{{ facing }} </label>
</template>

<style scoped>

</style>
