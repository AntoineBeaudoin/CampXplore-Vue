import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';

export const useCampsitesStore = defineStore('campsites', () => {
  const campsite = ref({});
  const campsites = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  async function getCampsites (){
    try {
      isLoading.value = true;
      errorMessage.value = "Une erreur s'est produite lors du chargement du site";

      const fetched = await apiFetch('/api/campsites', {
        method: 'GET',
        headers: {}
      });
      campsites.value = fetched.data;
    } catch (err) {
      errorMessage.value = "Une erreure s'est produite lors du chargement du site";
    }
    finally{
      isLoading.value = false;
    }
  }

  async function getCampsite (id) {
    isLoading.value = true;
    try {
      const fetched = await apiFetch('/api/campsites/' + id, {
          method: 'GET',
          headers: {}
      });

      campsite.value = fetched.data;
    } catch (err) {
      errorMessage.value = "Une erreur s'est produite lors du chargement des données...";
    }
    finally{
      isLoading.value = false;
    }
  }
  return {  
    campsites,
    isLoading,
    getCampsites,
    campsite,
    getCampsite
  }
})
