<template>
    <div v-if="isVisible" class="rounded-3 p-2 mb-3 text-center" :class="alertClass">
        {{ message }}
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAlertStore } from '@/stores/alert.js';
import { storeToRefs } from 'pinia';

const store = useAlertStore();
const {message, type, isVisible} = storeToRefs(store);

const alertClass = computed(() => {
    switch (type.value) {
        case 'success':
            return "bg-success text-light";
        case 'danger':
            return "bg-danger"
        case 'warning':
            return "bg-warning text-dark";
        default:
            return "bg-info text-dark";
    }
});
</script>