<template>
    <CampsiteCard :campsite="campsite"></CampsiteCard>
</template>

<script setup>
    import {onMounted, ref} from 'vue';
    import CampsiteCard from '@/components/CampsiteCard.vue';
    const API_BASE = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const campsite = ref({});

    const props = defineProps({
        id: {
            type: [String, Number],
            required: true,
        }
    })

    const getCampsite = async (id) => {
        let url = API_BASE + '/api/campsites/' + id;
        try {
            const res = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY
            }
            });
            if (!res.ok){
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            campsite.value = data.data;
        } catch (err) {
            console.log('Error ',err);
        }
    }

    onMounted(() => {
        getCampsite(props.id);
    })
</script>