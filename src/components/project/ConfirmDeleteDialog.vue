<script setup lang="ts">
import { storeToRefs } from "pinia";
import useFileStore from "../../fileStore.ts";
import { ref, watch } from "vue";

const { delete: remove } = useFileStore();

const { deleteConfirmation } = storeToRefs(useFileStore());

const confirmation = ref<HTMLDialogElement>();

const deleting = ref(false);

watch(deleteConfirmation, file => {
    const dialog = confirmation.value!;
    if (!file)
        dialog.close();
    else
        dialog.showModal();
});

async function deleteFile() {
    deleting.value = true;
    try {
        const file = deleteConfirmation.value;
        await remove(file);
        deleteConfirmation.value = "";
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <dialog ref="confirmation" v-on:close="deleteConfirmation = ''">
        <h4>Are you sure you want to delete this file?</h4>
        <p><code>{{ deleteConfirmation }}</code></p>
        <section class="choices">
            <button v-bind:disabled="deleting" v-on:click="deleteFile">Yes</button>
            <button v-bind:disabled="deleting" v-on:click="deleteConfirmation = ''" autofocus>No</button>
        </section>
    </dialog>
</template>

<style>
.choices {
    display: flex;
    gap: 1rem;
}

.choices button {
    flex: 1;
}
</style>
