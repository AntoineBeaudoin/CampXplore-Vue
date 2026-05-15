<template>
  <h1 class="text-center">Liste des campsites</h1>
  <div class=" border rounded text-align-center p-3">
    <h2>Filtrer les campsites</h2>
    <form id="formulaire-filtre" class="mb-4" @submit.prevent="">
      <div class="d-flex align-items-end">
        <div>
          <label for="type" class="form-label">Type de site de camp:</label>
          <select id="type" name="type" class="form-control" v-model="typeCampsite">
            <option value="">-- Sélectionner un type --</option>
            <option value="tente">Tente</option>
            <option value="vr">VR</option>
            <option value="chalet">Chalet</option>
            <option value="glamping">Glamping</option>
            <option value="arrière-pays">Arrière-pays</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div class="ms-3">
          <button type="submit" class="btn btn-primary me-3" @click="submitForm">Rechercher</button>
          <button type="button" id="btn-reset" class="btn btn-danger" @click="resetForm">Réinitialiser</button>
        </div>
      </div>
    </form>
  </div>
  <div class="row g-4 py-5">
    <p v-if="isLoading" class="col-12">Chargement en cours...</p>
    <p v-else-if="errorMessage" class="col-12 text-danger">{{ errorMessage }}</p>
    <p v-else-if="campsites.length === 0" class="col-12">Aucun campsite</p>
    <p v-if="campsites.length > 0" class="p-0 m-0 ms-3">Nombre d'emplacements trouvé: {{ campsites.length }}</p>
    <CampsiteCard class="col-12 col-lg-4" v-for="campsite in campsites" :key="campsite._id" :campsite="campsite">
    </CampsiteCard>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CampsiteCard from '@/components/CampsiteCard.vue';
import { useCampsitesStore } from '@/stores/campsites.js';
import { storeToRefs } from 'pinia';

const store = useCampsitesStore();
const {
  isLoading,
  campsites,
  errorMessage,
  typeCampsite
} = storeToRefs(store);

/**
 * Reset le filtre
 */
const resetForm = async () => {
  typeCampsite.value = '';
  await store.getCampsites();
}

/**
 * Fait un appel à l'API pour soumettre le formulaire de filtre
 */
async function submitForm() {
  await store.getCampsitesFiltre();
}

onMounted(() => {
  store.getCampsites();
})
</script>
