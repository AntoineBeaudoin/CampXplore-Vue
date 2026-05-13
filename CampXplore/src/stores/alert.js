import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', () => {

  const message = ref('');
  const type = ref('');
  const isVisible = ref(false);

  let delai = null;

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

  function clearAlert() {
    message.value = '';
    type.value = '';
    isVisible.value = false;
  }

  function success(_message, _duration = 3000) {
    showAlert(_message, 'success', _duration);
  }

  function error(_message, _duration = 3000) {
    showAlert(_message, 'danger', _duration);
  }

  function warning(_message, _duration = 3000) {
    showAlert(_message, 'warning', _duration);
  }

  function info(_message, _duration = 3000) {
    showAlert(_message, 'info', _duration);
  }

  return {
    success,
    error,
    warning,
    info
  }
});