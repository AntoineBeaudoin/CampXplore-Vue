import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { useRouter } from 'vue-router';

export const useReservationStore = defineStore('reservations', () => {
    const isLoading = ref('');
    const errorMessage = ref('');
    const reservations = ref([]);
    const reservation = ref({});
    const router = useRouter();
    
    async function getReservations() {
        reservations.value = [];
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

    async function getReservationById(id) {
        reservation.value = {};
        try {
            isLoading.value = true;
            errorMessage.value = "";

            const fetched = await apiFetch('/api/reservations/' + id, {
                method: 'GET',
                headers: {}
            });
            reservation.value = fetched.data;
        } catch (err) {
            errorMessage.value = "Une erreure s'est produite lors du chargement de la réservation";
            if (err.status === 404) {
                router.replace({ name: "NotFound" });
            }
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
        getReservationById,
        reservation
    }
})
