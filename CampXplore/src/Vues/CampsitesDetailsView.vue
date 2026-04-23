<template>
    <CampsiteCard :campsite="campsite"></CampsiteCard>
</template>

<script setup>
    import {onMounted, ref} from 'vue';
    import CampsiteCard from '@/components/CampsiteCard.vue';
    const campsite = ref({});

    const props = defineProps({
        id: {
            type: [String, Number],
            required: true,
        }
    })

    const getCampsite = async (id) => {
        let url = 'https://420-15d-fx-h26-tp3.vercel.app/api/campsites/' + id;
        try {
            const res = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': '85a212d5ab6f2002e461b8f72de5a6b36d8f47e84c373e2032365f058caeaa6a'
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