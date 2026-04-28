<template>
    <p v-if="isLoading">Chargement en cours...</p>
    <p v-else-if="errorMessage" class="col-12 text-danger">{{ errorMessage }}</p>
    <CampsiteCard :campsite="campsite"></CampsiteCard>
</template>

<script setup>
    import {onMounted} from 'vue';
    import CampsiteCard from '@/components/CampsiteCard.vue';
    import { useCampsitesStore } from '@/stores/campsites.js';
    import { storeToRefs } from 'pinia';

    const store = useCampsitesStore();
    const { isLoading, campsite, errorMessage } = storeToRefs(store);

    const props = defineProps({
        id: {
            type: [String, Number],
            required: true,
        }
    })

    onMounted(() => {
        store.getCampsite(props.id);
    })
</script>