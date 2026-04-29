<template>
  <h1 class="text-center">Liste des campsites</h1>
  <div class=" border rounded text-align-center p-3">
    <h2>Trouver un camping</h2>
    <form id="formulaire-filtre" class="mb-4" @submit.prevent="submitForm">
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
              <input type="number" id="nb_places_min" name="nb_places_min" class="form-control" v-model.trim="nbPlacesMin">
              <div v-if="nbPlacesMinErrorMessage" class="text-danger">{{ nbPlacesMinErrorMessage }}</div>
            </div>
          </div>
          <div class="col-md-3 p-3">
            <div>
              <label for="type" class="form-label">Type de site de camp:</label>
              <input type="text" id="type" name="type" class="form-control" v-model.trim="typeCampsite">
            </div>
          </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <button type="submit" class="btn btn-primary" @click="sendForm">Rechercher</button>
        <button type="button" id="btn-reset" class="btn btn-danger" @click="resetForm">Réinitialiser</button>
      </div>
    </form>
  </div>
  <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
      <p v-if="isLoading">Chargement en cours...</p>
      <p v-else-if="errorMessage" class="col-12 text-danger">{{ errorMessage }}</p>
      <p v-else-if="campsites.length === 0" class="col-12">Aucun campsite</p>
      <CampsiteCard v-for="campsite in campsites" :key="campsite._id" :campsite="campsite"></CampsiteCard>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import CampsiteCard from '@/components/CampsiteCard.vue';
import { useCampsitesStore } from '@/stores/campsites.js';
import { storeToRefs } from 'pinia';

const store = useCampsitesStore();
const { isLoading, campsites, errorMessage } = storeToRefs(store);

const dateDebut = ref('');
const dateFin = ref('');
const nbPlacesMin = ref('');
const typeCampsite = ref('');

const dateDebutErrorMessage = ref('');
const dateFinErrorMessage = ref('');
const nbPlacesMinErrorMessage = ref('');

function validerDate(){
  let isValid = true;
  dateDebutErrorMessage.value = "";
  dateFinErrorMessage.value = "";
  const aujourdHui = new Date();
  aujourdHui.setHours(0,0,0,0);
  if (!dateDebut.value){
    isValid = false;
    dateDebutErrorMessage.value = "La date de début ne peut pas être vide";
  }
  if (!dateFin.value){
    isValid = false;
    dateFinErrorMessage.value = "La date de fin ne peut pas être vide";
  }
  if(isValid){
    isValid = dateDebut.value < aujourdHui && dateFin.value < dateDebut.value;
  }
  return isValid;
}

function validerNbPlaces(){
  nbPlacesMinErrorMessage.value = '';
  if (nbPlacesMin.value && nbPlacesMin.value <= 0){
    nbPlacesMinErrorMessage.value = "Le nombre de places doit être suppérieur à 0";
    return false;
  }
  return true;
}

function validateForm() {
  const isValid = validerNbPlaces() && validerDate();
  return isValid;
}

function sendForm(){
  if (validateForm()){
    console.log("Ok");
  }
  console.log(dateDebutErrorMessage.value)
  console.log(dateFinErrorMessage.value)
  console.log(nbPlacesMinErrorMessage.value)
}

const resetForm = () => {
  dateDebut.value = '';
  dateFin.value = '';
  nbPlacesMin.value = '';
  typeCampsite.value = '';
}

function submitForm() {
  if (validateForm()) {
    console.log("Formulaire envoyé");
    resetForm();
  }
}

onMounted(() => {
  store.getCampsites();
})
</script>
