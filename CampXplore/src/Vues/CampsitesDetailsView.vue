<template>
    <p v-if="isLoading">Chargement en cours...</p>
    <div class="row">
        <CampsiteCard class="col-md-6 mb-3" :campsite="campsite" :afficherBtnNavReservation="false"></CampsiteCard>
        <div class="col-md-6">
            <div v-if="authStore.isUserConnected()" class="card shadow-sm">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Faire une réservation</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Date d'arrivée</label>
                        <input type="date" class="form-control" v-model="reservationTemp.startDate"
                            :class="{ 'is-invalid': erreursAjoutReservation.startDate }" />
                        <div class="invalid-feedback">La date d'arrivée est obligatoire et ne peut pas être dans le
                            passé.</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Date de départ</label>
                        <input type="date" class="form-control" v-model="reservationTemp.endDate"
                            :class="{ 'is-invalid': erreursAjoutReservation.endDate }" />
                        <div class="invalid-feedback">La date de départ est obligatoire et doit être plus tard que la
                            date de début.</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nombre de personnes</label>
                        <input type="number" class="form-control" min="1" v-model.number="reservationTemp.guests"
                            :class="{ 'is-invalid': erreursAjoutReservation.guests }" />
                        <div class="invalid-feedback">Le nombre de personnes doit être plus grand que 1 et plus petit ou
                            égal que la capacité de l'emplacement.</div>
                    </div>
                    <div v-if="campsite.type === 'vr'" class="mb-3">
                        <label class="form-label">Longueur du véhicule (m)</label>
                        <input type="number" class="form-control" min="1" v-model.number="reservationTemp.maxVehicleLength"
                            :class="{ 'is-invalid': erreursAjoutReservation.maxVehicleLength }" />
                        <div class="invalid-feedback">La longueur ne peut pas dépasser {{ campsite.maxVehicleLength }}
                            m.
                        </div>
                    </div>
                    <button class="btn btn-success w-100" @click="creerReservation">Confirmer la réservation</button>
                </div>
            </div>
            <div v-else class="card shadow-sm">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Faire une réservation</h5>
                </div>
                <div class="card-body text-center">
                    <router-link :to="{ name: 'login' }" class="btn btn-primary">Se connecter pour réserver</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CampsiteCard from '@/components/CampsiteCard.vue';
import { useCampsitesStore } from '@/stores/campsites.js';
import { useReservationStore } from '@/stores/reservations.js';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useCampsitesStore();
const reservationsStore = useReservationStore();
const authStore = useAuthStore();
const { isLoading, campsite } = storeToRefs(store);
const { reservationTemp, erreursAjoutReservation } = storeToRefs(reservationsStore);

const creerReservation = () => {
    if (reservationsStore.validerAjoutReservation(campsite.value)) {
        reservationTemp.value.campsite = campsite.value._id;
        console.log(reservationTemp.value);
        reservationsStore.postReservation(reservationTemp.value);
    }
};

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    }
})

onMounted(async () => {
    await store.getCampsite(props.id);
})
</script>