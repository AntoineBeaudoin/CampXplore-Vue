import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { useAlertStore } from '@/stores/alert.js';
import { useAuthStore } from './auth';


export const useCampsitesStore = defineStore('campsites', () => {
  const alertStore = useAlertStore();
  
  const campsite = ref({});
  const campsites = ref([]);
  const isLoading = ref(false);

  const dateDebut = ref('');
  const dateFin = ref('');
  const nbPlacesMin = ref('');
  const typeCampsite = ref('');

  const dateDebutErrorMessage = ref('');
  const dateFinErrorMessage = ref('');
  const nbPlacesMinErrorMessage = ref('');

  /**
   * Retourne la liste de tous les campsites
   * @async Attend la réponse de l'API
   * @returns {*} Liste de tous les campsites
   */
  async function getCampsites() {
    try {
      isLoading.value = true;

      const fetched = await apiFetch('/api/campsites', {
        method: 'GET',
        headers: {}
      });
      campsites.value = fetched.data;
    } catch (err) {
      alertStore.error("Une erreure s'est produite lors du chargement du site");
    }
    finally {
      isLoading.value = false;
    }
  }

  /**
   * Retourne le campsite ayant le même id
   * @async Attend la réponse de l'API
   * @param {*} id Identifiant unique du campsite
   * @returns {*} Un campsite
   */
  async function getCampsite(id) {
    isLoading.value = true;
    try {
      const fetched = await apiFetch('/api/campsites/' + id, {
        method: 'GET',
        headers: {}
      });

      campsite.value = fetched.data;
    } catch (err) {
      alertStore.error("Une erreur s'est produite lors du chargement des données...");
    }
    finally {
      isLoading.value = false;
    }
  }

  /**
   * Valide que la date de début et de fin sont valide pour le filtre des campsites
   * @returns {boolean} 
   */
  function validerDate() {
    let isValid = true;
    dateDebutErrorMessage.value = "";
    dateFinErrorMessage.value = "";
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    if (!dateDebut.value) {
      isValid = false;
      dateDebutErrorMessage.value = "La date de début ne peut pas être vide";
    }
    if (!dateFin.value) {
      isValid = false;
      dateFinErrorMessage.value = "La date de fin ne peut pas être vide";
    }
    if (isValid) {
      const debut = new Date(dateDebut.value);
      const fin = new Date(dateFin.value);
      if (debut < aujourdHui) {
        isValid = false;
        dateDebutErrorMessage.value = "La date d'arrivée doit être plus tard que la date d'aujourd'hui";
      }
      if (fin < debut) {
        isValid = false;
        dateFinErrorMessage.value = "La date de départ doit être plus tard que la date d'arrivée";
      }
    }
    return isValid;
  }

  /**
   * Valide que le nombre de places requise pour le filtre soit valide
   * @returns {boolean} 
   */
  function validerNbPlaces() {
    nbPlacesMinErrorMessage.value = '';
    if (nbPlacesMin.value && nbPlacesMin.value <= 0) {
      nbPlacesMinErrorMessage.value = "Le nombre de places doit être suppérieur à 0";
      return false;
    }
    return true;
  }

  /**
   * Valide le formulaire (nombre de places valides et dates valides)
   * @returns {boolean} 
   */
  function validateForm() {
    const isValid = validerNbPlaces() && validerDate();
    return isValid;
  }

  /**
   * Obtenir les campsites selon les paramêtres de recherche
   * @async Attend la réponse de l'API
   * @returns {*} Une liste de campsites recherchés
   */
  async function getCampsitesRecherche() {
    if (!validateForm()) {
      return await getCampsites();
    }
    let url = '/api/campsites';
    if (dateDebut.value && dateFin.value) {
      url = url + `/available?startDate=${dateDebut.value}&endDate=${dateFin.value}`;
      if (nbPlacesMin.value) {
        url = url + `&guests=${nbPlacesMin.value}`;
      }
      if (typeCampsite.value) {
        url = url + `&type=${typeCampsite.value}`;
      }
    }
    try {
      isLoading.value = true;

      const fetched = await apiFetch(url, {
        method: 'GET',
        headers: {}
      });
      campsites.value = fetched.data;
    } catch (err) {
      alertStore.error("Une erreure s'est produite lors du chargement du site");
    }
    finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtenir les campsites selon le filtre
   * @async Attend la réponse de l'API
   * @returns {*} Une liste de campsites qui respectent le filtre
   */
  async function getCampsitesFiltre() {
    let url = '/api/campsites';
    if (typeCampsite.value) {
      url = url + `?type=${typeCampsite.value}`;
    }
    try {
      isLoading.value = true;

      const fetched = await apiFetch(url, {
        method: 'GET',
        headers: {}
      });
      campsites.value = fetched.data;
    } catch (err) {
      alertStore.error("Une erreure s'est produite lors du chargement du site");
    }
    finally {
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
    getCampsitesRecherche,
    getCampsitesFiltre
  }
})
