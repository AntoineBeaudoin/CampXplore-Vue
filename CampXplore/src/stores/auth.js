import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';

export const useAuthStore = defineStore('auth', () => {
  const email = ref('');
  const pwd = ref('');
  const errorMessage = ref('');
  
  async function login() {
    errorMessage.value = '';
    try {
      const fetched = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ email: email.value, password: pwd.value })
      });
      const data = fetched.data;
      localStorage.setItem('token', data.token);
    } catch (err) {
      errorMessage.value = "Nom d'utilisateur ou mot de passe non valide";
      console.log("Err ", err);
    }
  }
  return{
    login,
    email,
    pwd,
    errorMessage
  }
})
