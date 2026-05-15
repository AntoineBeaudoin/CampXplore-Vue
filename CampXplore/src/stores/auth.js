import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { jwtDecode } from "jwt-decode";
import { useAlertStore } from '@/stores/alert.js';


export const useAuthStore = defineStore('auth', () => {
  const MESSAGE_ERREUR_MDP = "Le mot de passe doit être au moins 10 charactère " +
    "de long en ayant au moins une majuscule, un chiffre et un charactère spécial";

  const alertStore = useAlertStore();
  const errorMessage = ref('');

  const email = ref('');
  const pwd = ref('');
  const prenom = ref('');
  const nom = ref('');
  const telephone = ref('');
  const pwdC = ref('');
  const role = ref('');
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const tempPrenom = ref('');
  const tempNom = ref('');
  const tempTelephone = ref('');

  const prenomErrorMessage = ref('');
  const nomErrorMessage = ref('');
  const emailErrorMessage = ref('');
  const telephoneErrorMessage = ref('');
  const pwdErrorMessage = ref('');
  const pwdCErrorMessage = ref('');
  const currentPasswordErrorMessage = ref('');
  const newPasswordErrorMessage = ref('');
  const confirmPasswordErrorMessage = ref('');

  /**
   * Permet à l'utilisateur de se connecter
   * @async Requête sur la route POST de /api/auth/login
   * @returns {*} Bool indiquant si la connexion à été effectué avec succès
   */
  async function login() {
    resetChampsErreur();
    if (!validerCourriel(email.value)) {
      emailErrorMessage.value = "Le format du courriel n'est pas valide";
      return false;
    }
    try {
      const fetched = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ email: email.value, password: pwd.value })
      });
      const data = fetched.data;
      localStorage.setItem('jwt', data.token);
      alertStore.success("Connexion effectué avec succèes!");
      return true;
    } catch (err) {
      errorMessage.value = "Nom d'utilisateur ou mot de passe n'est pas valide";
      return false;
    }
  }

  /**
   * Vide le formulaire d'authentification
   */
  function resetRegisterForm() {
    prenom.value = '';
    nom.value = '';
    email.value = '';
    email.value = '';
    telephone.value = '';
    pwd.value = '';
    pwdC.value = '';
    resetChampsErreur();
  }

  /**
   * Vide les messages d'erreur
   */
  function resetChampsErreur() {
    errorMessage.value = '';
    prenomErrorMessage.value = '';
    nomErrorMessage.value = '';
    emailErrorMessage.value = '';
    telephoneErrorMessage.value = '';
    pwdErrorMessage.value = '';
    pwdCErrorMessage.value = '';
  }


  /** 
   * Vide le champs pour la modification du mot de passe 
   */
  function resetModificationMdp() {
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    currentPasswordErrorMessage.value = "";
    newPasswordErrorMessage.value = "";
    confirmPasswordErrorMessage.value = "";
  }

  /**
   * Valide que les champs prenom, nom, email et téléphone ne sont pas vide
   * et instancie leur messages d'erreur.
   * @returns {boolean} 
   */
  function validerChampsNonVides() {
    let isValid = true;
    if (!prenom.value) {
      prenomErrorMessage.value = "Le prénom ne peut pas être vide";
      isValid = false;
    }
    if (!nom.value) {
      nomErrorMessage.value = "Le nom ne peut pas être vide";
      isValid = false;
    }
    if (!tempNom.value) {
      prenomErrorMessage.value = "Le prénom ne peut pas être vide";
      isValid = false;
    }
    if (!tempPrenom.value) {
      nomErrorMessage.value = "Le nom ne peut pas être vide";
      isValid = false;
    }
    if (!email.value) {
      emailErrorMessage.value = "Le courriel ne peut pas être vide";
      isValid = false;
    }
    if (!telephone.value) {
      telephoneErrorMessage.value = "Le téléphone ne peut pas être vide";
      isValid = false;
    }
    if (!tempTelephone.value) {
      telephoneErrorMessage.value = "Le téléphone ne peut pas être vide";
      isValid = false;
    }
    return isValid;
  }

  /**
   * Valide que le mot de passe est valide
   * (Au moins 10 charactères, une majuscule, un nombre et un charactère spécial)
   * @param {*} mdp Le mot de passe à tester
   * @returns {boolean} Indique si le mot de passe est valide
   */
  const mdpValide = (mdp) => {
    const contientMajuscule = (str) => /[A-Z]/.test(str);
    const contientNombre = (str) => /[\d]/.test(str);
    const contientCharSpeciaux = (str) => /[@$!%*?&]/.test(str);
    const mdpAssezLong = mdp.length > 10;
    return contientMajuscule(mdp) && contientNombre(mdp) && contientCharSpeciaux(mdp) && mdpAssezLong;
  };

  /**
   * Valide que les champs pour le register sont valide
   * @returns {boolean} Indique si les champs pour le register sont valide
   */
  function validerRegister() {
    resetChampsErreur();
    let isValid = validerChampsNonVides();

    if (pwd.value !== pwdC.value) {
      isValid = false;
      pwdCErrorMessage.value = "Le mot de passe n'est pas pareille";
    }
    if (!validerCourriel(email.value)) {
      isValid = false;
      emailErrorMessage.value = "Le courriel n'a pas le bon format";
    }
    if (!validerTelephoneContient10Chiffres(telephone.value)) {
      isValid = false;
      telephoneErrorMessage.value = "Le numéro de téléphone doit contenir 10 chiffres";
    }
    if (!mdpValide(pwd.value)) {
      isValid = false;
      pwdErrorMessage.value = MESSAGE_ERREUR_MDP;
    }
    if (!isValid) {
      alertStore.error("Il y a au moins une erreur dans le formulaire");
    }
    return isValid;
  }


  /**
   * Valide que le courriel est valide
   * @returns {*} Indique si le courriel est valide
   */
  function validerCourriel(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  /**
   * Créer un compte utilisateur
   * @async Requête sur la route post de /api/auth/register 
   * @returns {*} Bool indiquant si le register a été effecté avec succès
   */
  async function register() {
    if (validerRegister()) {
      try {
        await apiFetch('/api/auth/register', {
          method: 'POST',
          headers: {},
          body: JSON.stringify(
            {
              firstName: prenom.value,
              lastName: nom.value,
              email: email.value,
              password: pwd.value,
              phone: telephone.value,
              role: "user"
            })
        });
        alertStore.success("Votre compte a bien été créer!");
        resetRegisterForm();
        return true;
      } catch (err) {
        if (/."status":409./.test(err)) {
          alertStore.error("Cette adresse courriel est déjà utilisée.");
        }
        else {
          alertStore.error("Une erreur est survenue");
        }
        return false;
      }
    }
  }

  /**
   * Récolter les données du compte utilisateur connecté
   * @async Requête sur la route GET de /api/auth/profile
   * @returns {*} 
   */
  async function getProfile() {
    try {
      const fetched = await apiFetch('/api/auth/profile', {
        method: 'GET',
        headers: {},
      });
      prenom.value = fetched.data.firstName;
      nom.value = fetched.data.lastName;
      email.value = fetched.data.email;
      telephone.value = fetched.data.phone;
      role.value = fetched.data.role;
      setValeursTemp();
    } catch (err) {
      alertStore.error("Une erreur est survenue lors de l'obtention du profile utilisateur");
    }
  }

  
  /** Sert à initier les valeurs temporaires */
  function setValeursTemp(){
    tempPrenom.value = prenom.value;
    tempNom.value = nom.value;
    tempTelephone.value = telephone.value;
  }

  /**
   * Valide que le numéro de téléphone contient bien 10 chiffres
   * @param {*} telephone Numéro de téléphone à valider
   * @returns {*} Booleen indiquant si le numéro de téléphone contient 10 chiffres
   */
  function validerTelephoneContient10Chiffres(telephone) {
    return /\d{10}/.test(telephone) && telephone.length === 10;
  }

  /**
   * Valide que les champs pour la mise à jours du profile sont valide
   * @returns {boolean} Indique si les champs pour la mise à jours du profile sont valide
   */
  function validerMajProfile() {
    resetChampsErreur();
    let isValid = validerChampsNonVides();

    if (!validerTelephoneContient10Chiffres(tempTelephone.value)) {
      isValid = false;
      telephoneErrorMessage.value = "Le numéro de téléphone doit contenir 10 chiffres";
    }
    if (!isValid) {
      alertStore.error("Il y a au moins une erreur dans le formulaire");
    }
    return isValid;
  }

  /**
   * Met à jours le profil de l'utilisateur connecté
   * @async Requête sur la route PUT de /api/auth/profile
   * @returns {*} 
   */
  async function majProfile() {
    errorMessage.value = "";
    if (validerMajProfile()) {
      try {
        const res = await apiFetch('/api/auth/profile', {
          method: 'PUT',
          headers: {},
          body: JSON.stringify(
            {
              firstName: tempPrenom.value,
              lastName: tempNom.value,
              phone: tempTelephone.value
            })
        });
        prenom.value = res.data.firstName;
        nom.value = res.data.lastName;
        telephone.value = res.data.phone;
        alertStore.success("La mise à jours du profile a été effectué avec succèes!");
      } catch (err) {
        alertStore.error("Une erreur est survenue lors de la mise à jours du profile utilisateur");
      }
    }
  }

  /**
   * Valide que le mot de passe est valide et affecte les variables d'erreurs en fonction de l'erreur
   * @returns {boolean} Indique si le mot de passe est valide
   */
  function validerModifierMdp() {
    let isValid = true;
    if (!currentPassword.value) {
      isValid = false;
      currentPasswordErrorMessage.value = "Votre mot de passe courrant est requis";
    }
    if (!mdpValide(newPassword.value)) {
      isValid = false;
      newPasswordErrorMessage.value = MESSAGE_ERREUR_MDP;
    }
    if (newPassword.value !== confirmPassword.value) {
      isValid = false;
      confirmPasswordErrorMessage.value = "Vous devez confirmer votre nouveau mot de passe";
    }
    if (!isValid) {
      alertStore.warning("Veuillez corriger les erreurs du formulaire de changement de mot de passe");
    }
    return isValid;
  }

  /**
   * Modifie le mot de passe de l'utilisateur connecté
   * @async Requête sur la route PATCH de /api/auth/password
   * @returns {*} 
   */
  async function modifierMdp() {
    errorMessage.value = "";
    currentPasswordErrorMessage.value = "";
    newPasswordErrorMessage.value = "";
    confirmPasswordErrorMessage.value = "";
    if (validerModifierMdp()) {
      try {
        await apiFetch('/api/auth/password', {
          method: 'PATCH',
          headers: {},
          body: JSON.stringify(
            {
              currentPassword: currentPassword.value,
              newPassword: newPassword.value
            })
        });
        resetModificationMdp();
        alertStore.success("La mise à jours du mot de passe a été effectué avec succèes!");
      } catch (err) {
        alertStore.error("Une erreur est survenue lors de la mise à jours du mot de passe");
      }
    }
  }

  /**
   * Valide si l'utilisateur connecté est un administrateur
   * @returns {boolean} Indique si l'utilisateur est connecté comme un administrateur
   */
  function isUserAdmin() {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return false;
    }
    try {
      const decoded = jwtDecode(token);
      return decoded.role === "admin";
    } catch {
      return false;
    }
  }


  /**
   * Valide si l'utilisateur connecté 
   * @returns {boolean} Indique si l'utilisateur est connecté
   */
  function isUserConnected() {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return false;
    }
    return true;
  }

  return {
    login,
    email,
    pwd,
    errorMessage,
    prenom,
    nom,
    telephone,
    pwdC,
    register,
    prenomErrorMessage,
    nomErrorMessage,
    emailErrorMessage,
    telephoneErrorMessage,
    pwdErrorMessage,
    pwdCErrorMessage,
    getProfile,
    role,
    majProfile,
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordErrorMessage,
    newPasswordErrorMessage,
    confirmPasswordErrorMessage,
    modifierMdp,
    isUserAdmin,
    resetRegisterForm,
    resetModificationMdp,
    resetChampsErreur,
    isUserConnected,
    tempPrenom,
    tempNom,
    tempTelephone
  }
})
