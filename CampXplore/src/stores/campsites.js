import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';

export const useCampsitesStore = defineStore('campsites', () => {
  const campsite = ref({});
  const campsites = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref('');

  const dateDebut = ref('');
  const dateFin = ref('');
  const nbPlacesMin = ref('');
  const typeCampsite = ref('');

  const dateDebutErrorMessage = ref('');
  const dateFinErrorMessage = ref('');
  const nbPlacesMinErrorMessage = ref('');

  
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
      const debut = new Date(dateDebut.value);
      const fin = new Date(dateFin.value);

      isValid = debut > aujourdHui && fin > debut;
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
  
  async function getCampsitesRecherche() {
    if (!validateForm()){
      return await getCampsites();
    }
    let url = '/api/campsites';
    if(dateDebut.value && dateFin.value){
      url = url + `/available?startDate=${dateDebut.value}&endDate=${dateFin.value}`;
      if (nbPlacesMin.value){
        url = url + `&guests=${nbPlacesMin.value}`;
      }
      if (typeCampsite.value){
        url = url + `&type=${typeCampsite.value}`
      }
    }
    try {
      isLoading.value = true;
      errorMessage.value = "Une erreur s'est produite lors du chargement du site";

      const fetched = await apiFetch(url, {
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

  return {  
    campsites,
    isLoading,
    getCampsites,
    campsite,
    getCampsite,
    dateDebut,
    dateFin,
    nbPlacesMin,
    typeCampsite,
    dateDebutErrorMessage,
    dateFinErrorMessage,
    nbPlacesMinErrorMessage,
    getCampsitesRecherche
  }
})
