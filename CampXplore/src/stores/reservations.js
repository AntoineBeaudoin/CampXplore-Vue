import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/utils/apiFetch.js';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useAlertStore } from '@/stores/alert.js';

const alertStore = useAlertStore();

export const useReservationStore = defineStore('reservations', () => {
    const isLoading = ref('');
    const typeStatut = ref('');
    const reservations = ref([]);
    const reservation = ref({});
    const router = useRouter();
    const route = useRoute();

    async function getReservations() {
        reservations.value = [];
        try {
            isLoading.value = true;

            const fetched = await apiFetch('/api/reservations', {
                method: 'GET',
                headers: {}
            });
            reservations.value = fetched.data;
        } catch (err) {
            alertStore.error("Une erreure s'est produite lors du chargement des réservations");
        }
        finally {
            isLoading.value = false;
        }
    }

    async function getReservationById(id) {
        reservation.value = {};
        try {
            isLoading.value = true;

            const fetched = await apiFetch('/api/reservations/' + id, {
                method: 'GET',
                headers: {}
            });
            reservation.value = fetched.data;
        } catch (err) {
            alertStore.error("Une erreure s'est produite lors du chargement de la réservation");
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
            alertStore.success('La réservation a été mise à jours avec succès');
        } catch (err) {
            alertStore.error("Une erreure s'est produite lors de la modification du statut de la réservation");
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

            await apiFetch('/api/reservations/' + reservationId, {
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
            alertStore.success("La réservation a été mise à jours avec succès");
        } catch (err) {
            alertStore.error("Une erreure s'est produite lors de la modification du statut de la réservation");
        } finally {
            isLoading.value = false;
        }
    }

    async function getReservationsFiltre() {
        let url = '/api/reservations';
        if (typeStatut.value) {
            url = url + `?status=${typeStatut.value}`;
        }
        try {
            isLoading.value = true;

            const fetched = await apiFetch(url, {
                method: 'GET',
                headers: {}
            });
            reservations.value = fetched.data;
        } catch (err) {
            alertStore.error(err);
        }
        finally {
            isLoading.value = false;
        }
    }

    return {
        getReservations,
        isLoading,
        reservations,
        getReservationById,
        reservation,
        patchReservationStatut,
        patchReservationStatutFromList,
        typeStatut,
        getReservationsFiltre
    }
})
