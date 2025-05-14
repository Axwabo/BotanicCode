<script setup lang="ts">
import FacingCheckbox from "./FacingCheckbox.vue";
</script>

<template>
    <div class="facing-checkboxes">
        <FacingCheckbox facing="north"/>
        <FacingCheckbox facing="east"/>
        <FacingCheckbox facing="south"/>
        <FacingCheckbox facing="west"/>
    </div>
</template>

<style scoped>
.facing-checkboxes {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr;
}
</style>
