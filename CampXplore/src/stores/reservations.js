import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';


export const useReservationStore = defineStore('reservations', () => {
    const isLoading = ref('');
    const errorMessage = ref('');
    const reservations = ref([]);
    const reservation = ref({});
    const router = useRouter();
    const route = useRoute();

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

    async function patchReservationStatut(newStatus) {
        try {
            isLoading.value = true;
            errorMessage.value = "";
            const reservationId = route.params.id;

            await apiFetch('/api/reservations/' + reservationId, {
                method: 'PATCH',
                headers: {},
                body: JSON.stringify(
                    {
                        status: newStatus,
                    })
            });
            reservation.value = getReservationById(reservationId);
        } catch (err) {
            errorMessage.value = "Une erreure s'est produite lors de la modification du statut de la réservation";
            if (err.status === 404) {
                router.replace({ name: "NotFound" });
            }
        }
        finally {
            isLoading.value = false;
        }
    }

    async function patchReservationStatutFromList(newStatus, reservationId) {
        try {
            isLoading.value = true;
            errorMessage.value = "";

            const updatedReservation = await apiFetch('/api/reservations/' + reservationId, {
                method: 'PATCH',
                headers: {},
                body: JSON.stringify({
                    status: newStatus,
                })
            });

            const index = reservations.value.findIndex(r => r._id === reservationId);
            if (index !== -1) {
                reservations.value[index].status = newStatus;
            }

        } catch (err) {
            errorMessage.value = "Une erreure s'est produite lors de la modification du statut de la réservation";
        } finally {
            isLoading.value = false;
        }
    }

    return {
        getReservations,
        isLoading,
        errorMessage,
        reservations,
        getReservationById,
        reservation,
        patchReservationStatut,
        patchReservationStatutFromList
    }
})
