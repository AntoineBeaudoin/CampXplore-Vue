import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', () => {

  const message = ref('');
  const type = ref('');
  const isVisible = ref(false);

  let delai = null;

  /**
   * Afficher un message à l'écran
   * @param {*} _message Le message à afficher
   * @param {*} _type Le type de message à afficher
   * @param {number} [_duration=3000] Le nombre de temps que le message doit rester
   */
  function showAlert(_message, _type, _duration = 3000) {

    message.value = _message;
    type.value = _type;
    isVisible.value = true;

    if (delai) {
      clearTimeout(delai);
    }

    delai = setTimeout(() => {
      clearAlert();
    }, _duration);
  }
  
  /** Enlève l'alerte */
  function clearAlert() {
    message.value = '';
    type.value = '';
    isVisible.value = false;
  }
  
  /**
   * Affiche un message de succès
   * @param {*} _message Le message à afficher
   * @param {number} [_duration=3000] La durée de milisecondes que le message doit rester affiché 
   */
  function success(_message, _duration = 3000) {
    showAlert(_message, 'success', _duration);
  }

  /**
   * Affiche un message d'erreur
   * @param {*} _message Le message à afficher 
   * @param {number} [_duration=3000] La durée de milisecondes que le message doit rester affiché
   */
  function error(_message, _duration = 3000) {
    showAlert(_message, 'danger', _duration);
  }
  
  /**
   * Affiche un message de mise en garde
   * @param {*} _message Le message à afficher 
   * @param {number} [_duration=3000] La durée de milisecondes que le message doit rester affiché
   */
  function warning(_message, _duration = 3000) {
    showAlert(_message, 'warning', _duration);
  }
  
  /**
   * Affiche un message d'information
   * @param {*} _message Le message à afficher 
   * @param {number} [_duration=3000] La durée de milisecondes que le message doit rester affiché
   */
  function info(_message, _duration = 3000) {
    showAlert(_message, 'info', _duration);
  }

  return {
    message,
    isVisible,
    type,
    success,
    error,
    warning,
    info
  }
});