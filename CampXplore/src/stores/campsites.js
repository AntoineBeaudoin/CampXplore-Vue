import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { useAlertStore } from '@/stores/alert.js';
import { useAuthStore } from './auth';


export const useCampsitesStore = defineStore('campsites', () => {
  const alertStore = useAlertStore();

  const campsite = ref({});
  const campsites = ref([]);
  const isLoading = ref(false);
  const campingExisteDeja = ref(false);

  const dateDebut = ref('');
  const dateFin = ref('');
  const nbPlacesMin = ref('');
  const typeCampsite = ref('');
  const vehicleLength = ref('');

  const dateDebutErrorMessage = ref('');
  const dateFinErrorMessage = ref('');
  const nbPlacesMinErrorMessage = ref('');
  const vehicleLengthErrorMessage = ref('');

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
      if (fin <= debut) {
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
   * Valider que la longueur du véhicule est valide
   * @returns {boolean} Bool indiquant si la longuer du véhicule est valide
   */
  function validerVehicleLength(){
    vehicleLengthErrorMessage.value = "";
    if (typeCampsite.value === 'vr'){
      if (vehicleLength.value < 0){
        vehicleLengthErrorMessage.value = "La longueur du véhicule ne peut pas être négative";
      }
    } 
    return true;
  }

  /**
   * Valide le formulaire (nombre de places valides et dates valides)
   * @returns {boolean} 
   */
  function validateForm() {
    const isValid = validerNbPlaces() && validerDate() && validerVehicleLength();
    return isValid;
  }

  /**
   * Obtenir les campsites selon les paramêtres de recherche
   * @async Attend la réponse de l'API
   * @returns {*} Une liste de campsites recherchés
   */
  async function getCampsitesRecherche() {
    if (!validateForm()) {
      return [];
    }
    let url = '/api/campsites';
    if (dateDebut.value && dateFin.value) {
      url = url + `/available?startDate=${dateDebut.value}&endDate=${dateFin.value}`;
      if (nbPlacesMin.value) {
        url = url + `&guests=${nbPlacesMin.value}`;
      }
      if (typeCampsite.value && typeCampsite.value === 'vr') {
        if (vehicleLength.value && vehicleLength.value > 0){
          url = url + `&vehicleLength=${vehicleLength.value}&type=vr`;
        }
        else{
          url = url + `&type=${typeCampsite.value}`;
        }
      }
      else if (typeCampsite.value){
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

  /**
   * Supprimer un campsite
   * @async Attend la réponse de l'API
   * @param {*} id ID du campsite à supprimer
   * @returns {*} Message indiquant le résultat de l'opération
   */
  async function supprimerUnCampsite(id) {
    let url = '/api/campsites/' + id;
    try {
      await apiFetch(url, {
        method: 'DELETE',
        headers: {}
      });
      alertStore.success("L'emplacement de camping a été supprimé avec succèes.");
      const index = campsites.value.findIndex(c => c._id === id);
      if (index !== -1) {
        campsites.value.splice(index, 1);
      }
    }
    catch (err) {
      if (/.409./.test(err)) {
        alertStore.error("L'emplacement ne peut pas être supprimé car il possède des réservations en cours ou non terminées.");
      }
      else {
        alertStore.error("L'emplacement n'a pas pu être supprimé.");
      }
    }
  }


  /**
   * Modifier un campsite
   * @async Attend la réponse de l'api
   * @param {*} id Id de l'emplacement
   * @param {*} body Corps incluant les champs modifiés
   * @returns {*} Message indiquant le résultat de l'opération
   */
  async function modifierUnCampsite(id, body) {
    let url = '/api/campsites/' + id;
    campingExisteDeja.value = false;

    try {
      const res = await apiFetch(url, {
        method: 'PUT',
        headers: {},
        body: JSON.stringify(body)
      });
      alertStore.success("L'emplacement de camping a été mis à jours avec succèes.");
      const index = campsites.value.findIndex(c => c._id === id);
      if (index !== -1) {
        campsites.value[index] = res.data;
      }
    } catch (err) {
      if (/.409./.test(err)) {
        campingExisteDeja.value = true;
      }
      else {
        alertStore.error("L'emplacement n'a pas pu être mis à jours.");
      }
    }
  }

  
  /**
   * Ajouter un emplacement
   * @async Attend la réponse de l'API
   * @param {*} body Corps de la requête (champs de l'emplacement)
   * @returns {*} Message indiquant le résultat de l'opération
   */
  async function ajouterUnCampsite(body) {
    let url = '/api/campsites';

    try {
      const res = await apiFetch(url, {
        method: 'POST',
        headers: {},
        body: JSON.stringify(body)
      });
      alertStore.success("L'emplacement de camping a été ajouté avec succèes.");
      campsites.value.push(res.data);
    } catch (err) {
      alertStore.error("L'emplacement n'a pas pu être ajouté.");
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
    getCampsitesFiltre,
    supprimerUnCampsite,
    modifierUnCampsite,
    campingExisteDeja,
    ajouterUnCampsite,
    vehicleLength,
    vehicleLengthErrorMessage
  }
})
