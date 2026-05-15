<template>
  <h1 class="text-center">Bienvenue chez CampXplore</h1>
  <div class="d-flex mx-3 my-4 justify-content-center">
    <p class="me-3 mb-0 d-inline">Découvrez tous nos sites de camping: </p>
    <router-link to="/campsites" class="btn btn-primary">Voir tous nos campsites</router-link>
  </div>
  <div class=" border rounded text-align-center p-3">
    <h2>Trouver un camping</h2>
    <form id="formulaire-filtre" class="mb-4" @submit.prevent="">
      <div class="row">
        <div class="col-md-3 p-3">
          <div>
            <label for="dateDebut" class="form-label">Date d'arrivée:</label>
            <input type="date" id="dateDebut" name="dateDebut" class="form-control" v-model.trim="dateDebut">
            <div v-if="dateDebutErrorMessage" class="text-danger">{{ dateDebutErrorMessage }}</div>
          </div>
        </div>
        <div class="col-md-3 p-3">
          <div>
            <label for="dateFin" class="form-label">Date de départ:</label>
            <input type="date" id="dateFin" name="dateFin" class="form-control" v-model.trim="dateFin">
            <div v-if="dateFinErrorMessage" class="text-danger">{{ dateFinErrorMessage }}</div>
          </div>
        </div>
        <div class="col-md-3 p-3">
          <div>
            <label for="nb_places_min" class="form-label">Nombre de personnes:</label>
            <input type="number" id="nb_places_min" name="nb_places_min" class="form-control"
              v-model.trim="nbPlacesMin">
            <div v-if="nbPlacesMinErrorMessage" class="text-danger">{{ nbPlacesMinErrorMessage }}</div>
          </div>
        </div>
        <div class="col-md-3 p-3">
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
        </div>
        <div v-if="typeCampsite === 'vr'" class="col-md-12 p-3">
          <div>
            <label for="vLength" class="form-label">Longueur du véhicule:</label>
            <input type="number" id="vLength" name="vLength" class="form-control"
              v-model.trim="vehicleLength">
            <div v-if="vehicleLengthErrorMessage" class="text-danger">{{ vehicleLengthErrorMessage }}</div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <button type="submit" class="btn btn-primary" @click="submitForm">Rechercher</button>
        <button type="button" id="btn-reset" class="btn btn-danger" @click="resetForm">Réinitialiser</button>
      </div>
    </form>
  </div>
  <div class="row g-4 py-5">
    <p v-if="isLoading" class="col-12">Chargement en cours...</p>
    <p v-else-if="errorMessage" class="col-12 text-danger">{{ errorMessage }}</p>
    <p v-else-if="campsites.length === 0" class="col-12">Aucun campsite trouvé - veuillez faire une nouvelle recherche
    </p>
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
  errorMessage, dateDebut,
  dateFin,
  nbPlacesMin,
  typeCampsite,
  vehicleLength,
  dateDebutErrorMessage,
  dateFinErrorMessage,
  nbPlacesMinErrorMessage,
  vehicleLengthErrorMessage
} = storeToRefs(store);

const resetForm = async () => {
  dateDebut.value = '';
  dateFin.value = '';
  nbPlacesMin.value = '';
  typeCampsite.value = '';
  campsites.value = [];
  vehicleLength.value = '';
}

async function submitForm() {
  await store.getCampsitesRecherche();
}

onMounted(() => {
  campsites.value = [];
})
</script>
