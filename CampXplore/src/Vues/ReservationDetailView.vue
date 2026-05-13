<template>
    <div>
        <RouterLink class="link-info" :to="{ name: 'reservations' }">Réservations</RouterLink> / Détails
    </div>
    <div class="mt-3">
        <p v-if="isLoading" class="d-block">Chargement en cours...</p>
        <section v-else-if="reservation && reservation.campsite" class="row gap-3 align-items-start">
            <div class="border rounded p-0 col-md-7">
                <div class="row col-12 bg-info border rounded w-100 m-0 pt-3">
                    <p class="col-sm-6">
                        <strong>Réservation</strong>
                        <span class="badge ms-3" :class="classeStatus(reservation.status)">{{ reservation.status
                            }}</span>
                    </p>
                    <p class="col-sm-6">#{{ reservation._id }}</p>
                </div>
                <div class="p-3 pb-0">
                    <div class="row">
                        <p class="col-sm-6"><strong>Emplacement</strong></p>
                        <RouterLink class="col-sm-6 link-info"
                            :to="{ name: 'CampsitesDetails', params: { id: reservation.campsite._id } }">{{
                            reservation.campsite.name }}</RouterLink>
                    </div>
                    <div class="row">
                        <p class="col-sm-6"><strong>Lieu</strong></p>
                        <p class="col-sm-6">{{ reservation.campsite.location }}</p>
                    </div>
                    <div class="row">
                        <p class="col-sm-6"><strong>Début de la réservation</strong></p>
                        <p class="col-sm-6">{{ new Date(reservation.startDate).toLocaleDateString('fr-ca') }}</p>
                    </div>
                    <div class="row">
                        <p class="col-sm-6"><strong>Fin de la réservation</strong></p>
                        <p class="col-sm-6">{{ new Date(reservation.endDate).toLocaleDateString('fr-ca') }}</p>
                    </div>
                    <div class="row">
                        <p class="col-sm-6"><strong>Personnes</strong></p>
                        <p class="col-sm-6">{{ reservation.guests }}</p>
                    </div>
                    <div class="row">
                        <p class="col-sm-6"><strong>Durée</strong></p>
                        <p class="col-sm-6">{{ Math.ceil((new Date(reservation.endDate) - new
                            Date(reservation.startDate)) / (1000 * 60 * 60 * 24)) }} nuit(s)</p>
                    </div>
                    <div class="row">
                        <p class="col-sm-6"><strong>Type</strong></p>
                        <p class="col-sm-6">{{ reservation.campsite.type }}</p>
                    </div>
                    <div v-if="reservation.campsite.type === 'vr'" class="row">
                        <p class="col-sm-6"><strong>Longuer du véhicule</strong></p>
                        <p class="col-sm-6">{{ reservation.campsite.maxVehicleLength }}m</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="border rounded p-0">
                    <div class="row col-12 bg-info border rounded w-100 m-0 pt-3">
                        <p><strong>Résumé financier</strong></p>
                    </div>
                    <div class="p-3 pb-0">
                        <div class="d-flex justify-content-between">
                            <p class="">{{ Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) /
                                (1000 * 60 * 60 * 24)) }} nuit(s) x {{ reservation.campsite.pricePerNight }}</p>
                            <p class="">{{ reservation.totalPrice }}$</p>
                        </div>
                        <div class="d-flex justify-content-between border-top pt-3">
                            <p class=""><strong>Prix total</strong></p>
                            <p class=""><strong>{{ reservation.totalPrice }}$</strong></p>
                        </div>
                    </div>
                </div>
                <div>
                    <button v-if="reservation.status === 'pending'" @click="modifierStatutReservation('cancelled')" class="btn btn-danger mt-3 w-100">Annuler</button>
                    <button v-if="reservation.status === 'pending' && isUserAdmin()" @click="modifierStatutReservation('confirmed')" class="btn btn-primary mt-3 w-100">Confirmer</button>
                    <button v-if="reservation.status === 'confirmed' && isUserAdmin()" @click="modifierStatutReservation('pending')" class="btn btn-warning mt-3 w-100">Remettre en attente</button>
                    <button v-if="reservation.status === 'confirmed' && isUserAdmin()" @click="modifierStatutReservation('cancelled')" class="btn btn-danger mt-3 w-100">Annuler</button>
                    <button v-if="reservation.status === 'cancelled' && isUserAdmin()" @click="modifierStatutReservation('pending')" class="btn btn-warning mt-3 w-100">Remettre en attente</button>
                    <RouterLink class="btn btn-secondary mt-3 w-100" :to="{ name: 'reservations' }">Retour aux réservations</RouterLink>
                </div>
            </div>
        </section>
        <div v-else>
            Impossible de charger la réservation
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useReservationStore } from '@/stores/reservations.js';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useReservationStore();
const authStore = useAuthStore();
const { isLoading, reservation } = storeToRefs(store);

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    }
});

function classeStatus(status) {
    switch (status) {
        case "confirmed":
            return "bg-success";
        case "cancelled":
            return "bg-secondary";
        default:
            return "bg-warning text-dark";
    }
}

function isUserAdmin(){
    return authStore.isUserAdmin();
}

async function modifierStatutReservation(nouveauStatut){
    await store.patchReservationStatut(nouveauStatut);
}

onMounted(async () => {
    await store.getReservationById(props.id);
});
</script>