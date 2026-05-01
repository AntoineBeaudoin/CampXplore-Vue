<template>
    <div v-if="message && !esSuccees" class="bg-danger rounded-3">
        <p class="p-3 m-0 text-dark fw-bold">{{ message }}</p>
    </div>
    <div v-if="message && esSuccees" class="bg-success rounded-3">
        <p class="p-3 m-0 text-dark fw-bold">{{ message }}</p>
    </div>
</template>

<script setup>
    defineProps({
        message : {
            type: Object
        },
        esSuccees: {
            type: Boolean
        }
    })
</script>