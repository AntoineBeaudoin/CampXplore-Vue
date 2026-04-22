<template>
    <h1 class="text-center">Liste des campsites</h1>
    <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <p v-if="isLoading">Chargement en cours...</p>
        <p v-else-if="campsites.length === 0" class="col-12">Aucun campsite</p>
        <CampsiteCard v-for="campsite in campsites" :key="campsite._id" :campsite="campsite"></CampsiteCard>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CampsiteCard from '@/components/CampsiteCard.vue';

const campsites = ref([]);
const isLoading = ref(false);

const getCampsites = async () => {
  let url = 'https://420-15d-fx-h26-tp3.vercel.app/api/campsites';

  try {
    isLoading.value = true;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': '85a212d5ab6f2002e461b8f72de5a6b36d8f47e84c373e2032365f058caeaa6a'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    campsites.value = data.data;
  } catch (err) {
    console.log('Error ', err);
  }
  finally{
    isLoading.value = false;
  }
}

onMounted(() => {
  getCampsites();
})
</script>
