import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';

export const useReservationStore = defineStore('reservations', () => {
    const isLoading = ref('');
    const errorMessage = ref('');
    const reservations = ref('');
    
    async function getReservations() {
        try {
            isLoading.value = true;
            errorMessage.value = "";

            const fetched = await apiFetch('/api/reservations', {
                method: 'GET',
                headers: {}
            });
            reservations.value = fetched.data;
        } catch (err) {
            errorMessage.value = "Une erreure s'est produite lors du chargement des réservations";
        }
        finally {
            isLoading.value = false;
        }
    }

    return {
        getReservations,
        isLoading,
        errorMessage,
        reservations,
    }
})
