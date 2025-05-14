<script setup lang="ts">

</script>

<template>
    <div class="farm-toolbar">
        <div class="tool-selector">
            <input type="radio" name="tool" id="tilePlacer" checked>
            <label for="tilePlacer">Place Tiles</label>
            <input type="radio" name="tool" id="fencePlacer">
            <label for="fencePlacer">Place Fences</label>
        </div>
    </div>
</template>

<style scoped>
.farm-toolbar {
    display: grid;
    grid-template-columns: auto 1fr;
}

.tool-selector {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: auto 1fr;
}
</style>
