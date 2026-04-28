<template>
    <CampsiteCard :campsite="campsite"></CampsiteCard>
</template>

<script setup>
    import {onMounted, ref} from 'vue';
    import CampsiteCard from '@/components/CampsiteCard.vue';
    import { apiFetch } from '@/utils/apiFetch.js';
    const campsite = ref({});

    const props = defineProps({
        id: {
            type: [String, Number],
            required: true,
        }
    })

    const getCampsite = async (id) => {
        try {
            const fetched = await apiFetch('/api/campsites/' + id, {
                method: 'GET',
                headers: {}
            });

            campsite.value = fetched.data;
        } catch (err) {
            console.log('Error ',err);
        }
    }

    onMounted(() => {
        getCampsite(props.id);
    })
</script>