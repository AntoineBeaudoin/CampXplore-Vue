import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
  const MESSAGE_ERREUR_MDP = "Le mot de passe doit être au moins 10 charactère " +
    "de long en ayant au moins une majuscule, un chiffre et un charactère spécial";

  const errorMessage = ref('');
  const successMessage = ref('');

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
   * @returns {*} 
   */
  async function login() {
    errorMessage.value = '';
    try {
      const fetched = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ email: email.value, password: pwd.value })
      });
      const data = fetched.data;
      localStorage.setItem('jwt', data.token);
    } catch (err) {
      errorMessage.value = "Nom d'utilisateur ou mot de passe non valide";
      console.log("Err ", err);
    }
  }

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
    if (!email.value) {
      emailErrorMessage.value = "Le courriel ne peut pas être vide";
      isValid = false;
    }
    if (!telephone.value) {
      prenomErrorMessage.value = "Le téléphone ne peut pas être vide";
      isValid = false;
    }
    return isValid;
  }

  const mdpValide = (v) => {
    const contientMajuscule = (str) => /[A-Z]/.test(str);
    const contientNombre = (str) => /[\d]/.test(str);
    const contientCharSpeciaux = (str) => /[@$!%*?&]/.test(str);
    const mdpAssezLong = v.length > 10;
    return contientMajuscule(v) && contientNombre(v) && contientCharSpeciaux(v) && mdpAssezLong;
  };

  function validerRegister() {
    errorMessage.value = '';
    prenomErrorMessage.value = '';
    nomErrorMessage.value = '';
    emailErrorMessage.value = '';
    telephoneErrorMessage.value = '';
    pwdErrorMessage.value = '';
    pwdCErrorMessage.value = '';
    let isValid = validerChampsNonVides();

    if (pwd.value !== pwdC.value) {
      isValid = false;
      pwdCErrorMessage.value = "Le mot de passe n'est pas pareille";
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
      isValid = false;
      emailErrorMessage.value = "Le courriel n'a pas le bon format";
    }
    if (!validerTelephoneContient10Chiffres()) {
      isValid = false;
      telephoneErrorMessage.value = "Le numéro de téléphone doit contenir 10 chiffres";
    }
    if (!mdpValide(pwd.value)) {
      isValid = false;
      pwdErrorMessage.value = MESSAGE_ERREUR_MDP;
    }
    if (!isValid) {
      errorMessage.value = "Il y a au moins une erreur dans le formulaire";
    }
    return isValid;
  }


  /**
   * Créer un compte utilisateur
   * @async Requête sur la route post de /api/auth/register 
   * @returns {*} 
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
      } catch (err) {
        errorMessage.value = "Une erreur est survenue";
        console.log("Err ", err);
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
    } catch (err) {
      errorMessage.value = "Une erreur est survenue lors de l'obtention du profile utilisateur";
      console.log("Err ", err);
    }
  }

  function validerTelephoneContient10Chiffres() {
    return /\d{10}/.test(telephone.value);
  }

  function validerMajProfile() {
    errorMessage.value = '';
    prenomErrorMessage.value = '';
    nomErrorMessage.value = '';
    telephoneErrorMessage.value = '';
    let isValid = validerChampsNonVides();

    if (!validerTelephoneContient10Chiffres()) {
      isValid = false;
      telephoneErrorMessage.value = "Le numéro de téléphone doit contenir 10 chiffres";
    }
    if (!isValid) {
      errorMessage.value = "Il y a au moins une erreur dans le formulaire";
    }
    return isValid;
  }


  /**
   * Met à jours le profil de l'utilisateur connecté
   * @async Requête sur la route PUT de /api/auth/profile
   * @returns {*} 
   */
  async function majProfile() {
    successMessage.value = "";
    errorMessage.value = "";
    if (validerMajProfile()) {
      try {
        await apiFetch('/api/auth/profile', {
          method: 'PUT',
          headers: {},
          body: JSON.stringify(
            {
              firstName: prenom.value,
              lastName: nom.value,
              phone: telephone.value,
              role: role.value
            })
        });
        successMessage.value = "La mise à jours du profile a été effectué avec succèes!";
      } catch (err) {
        errorMessage.value = "Une erreur est survenue lors de la mise à jours du profile utilisateur";
        console.log("Err ", err);
      }
    }
  }

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
      errorMessage.value = "Veuillez corriger les erreurs du formulaire de changement de mot de passe";
    }
    return isValid;
  }


  /**
   * Modifie le mot de passe de l'utilisateur connecté
   * @async Requête sur la route PATCH de /api/auth/password
   * @returns {*} 
   */
  async function modifierMdp() {
    successMessage.value = "";
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
        successMessage.value = "La mise à jours du mot de passe a été effectué avec succèes!";
      } catch (err) {
        errorMessage.value = "Une erreur est survenue lors de la mise à jours du mot de passe";
        console.log("Err ", err);
      }
    }
  }

  
  /**
   * Valide si l'utilisateur connecté est un administrateur
   * @returns {boolean} 
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
    successMessage,
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordErrorMessage,
    newPasswordErrorMessage,
    confirmPasswordErrorMessage,
    modifierMdp,
    isUserAdmin
  }
})
