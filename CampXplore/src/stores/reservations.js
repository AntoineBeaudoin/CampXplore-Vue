import { ref, computed } from 'vue'
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

    /**
     * Calcule le prix courrant de la réservation
     * @type {*} Le montant de la réservation
     */
    const prixCourrant = computed(() => {
        if (!reservationTemp.value.startDate || !reservationTemp.value.endDate || !reservationTemp.value?.pricePerNight) {
            return 0
        }
        const msParJour = 1000 * 60 * 60 * 24;
        const nbJours = (new Date(reservationTemp.value.endDate) - new Date(reservationTemp.value.startDate)) / msParJour;
        return nbJours * reservationTemp.value.pricePerNight;
    })

    /**
     * Réservation temporaire représentant la réservation à ajouter
     * @type {*} Réservation
     */
    const reservationTemp = ref({
        campsite: "",
        startDate: "",
        endDate: "",
        guests: "",
        maxVehicleLength: null,
        pricePerNight: 0
    });

    /**
     * Indique les erreures dans la création d'une réservation
     * @type {*} Références d'erreurs
     */
    const erreursAjoutReservation = ref({
        startDate: false,
        endDate: false,
        guests: false,
        maxVehicleLength: false,
    });

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

    /**
     * Valide que la date de début de la réservation est valide pour sa création
     * @param {*} dDebut Date de début
     * @param {*} aujourdHui Date d'ajourd'hui
     * @returns {boolean} Indique si la date de début est valide
     */
    function dateDebutEsValid(dDebut, aujourdHui) {
        return dDebut >= aujourdHui;
    }

    /**
     * Valide que la date de début est avant la date de fin
     * @param {*} dDebut Date de début
     * @param {*} dFin Date de fin
     * @returns {boolean} Indique si la date de fin est valide
     */
    function dateFinEsValid(dDebut, dFin) {
        return dFin > dDebut;
    }

    /**
     * Valide que le nombre d'invités est valide
     * @returns {boolean} Indique si le nombre d'invités est valide
     */
    function nbInvitesEsValid(campsite) {
        return reservationTemp.value.guests >= 1 &&
            reservationTemp.value.guests <= campsite.capacity;
    }

    /**
     * Valide que la longuer du véhicule est valide
     * @returns {boolean} Indique si la longuer du véhicule est valide
     */
    function maxVehicleLengthEsValid(campsite) {
        return reservationTemp.value.maxVehicleLength >= 1 &&
            reservationTemp.value.maxVehicleLength <= campsite.maxVehicleLength;
    }

    /**
     * Valide que tous les champs sont valide pour l'ajout d'une réservation
     * @param {*} campsite Le campsite où faire la réservation
     * @returns {boolean} Indique si la réservation peut être effectué
     */
    function validerAjoutReservation(campsite) {
        const aujourdHui = new Date().setHours(0, 0, 0, 0);
        const dDebut = new Date(reservationTemp.value.startDate);
        const dFin = new Date(reservationTemp.value.endDate);

        erreursAjoutReservation.value.startDate = !dateDebutEsValid(dDebut, aujourdHui);
        erreursAjoutReservation.value.endDate = !dateFinEsValid(dDebut, dFin);
        erreursAjoutReservation.value.guests = !nbInvitesEsValid(campsite);

        if (campsite.type === 'vr') {
            erreursAjoutReservation.value.maxVehicleLength = !maxVehicleLengthEsValid(campsite);
        }

        return !erreursAjoutReservation.value.startDate &&
            !erreursAjoutReservation.value.endDate &&
            !erreursAjoutReservation.value.guests &&
            !erreursAjoutReservation.value.maxVehicleLength;
    };

    /**
     * Ajouter une réservation
     * @async Attend la réponse de l'API
     * @param {*} body Données de la réservation
     * @returns {*} Bool indiquant si l'oppération à été un succès et envoie un message indiquant le résultat de l'opération
     */
    async function postReservation(body) {
        let url = '/api/reservations';
        try {
            await apiFetch(url, {
                method: 'POST',
                headers: {},
                body: JSON.stringify({
                    campsite: body.campsite,
                    startDate: body.startDate,
                    endDate: body.endDate,
                    guests: body.guests,
                    vehicleLength: body.maxVehicleLength
                })
            });
            alertStore.success("Réservation créer avec succèes");
            return true;
        }
        catch (err) {
            if (/.409./.test(err)) {
                alertStore.error("L'emplacement n'est pas disponible pour les dates sélectionnées.");
            }
            else {
                alertStore.error("Une erreur est survenue lors de la réservation");
            }
            return false;
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
        getReservationsFiltre,
        postReservation,
        validerAjoutReservation,
        erreursAjoutReservation,
        reservationTemp,
        prixCourrant
    }
})
