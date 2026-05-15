<template>
    <h1>Réservations des utilisateurs</h1>
    <div class=" border rounded text-align-center p-3">
        <form id="formulaire-filtre-statut" @submit.prevent="">
            <div class="d-flex align-items-end">
                <div>
                    <label for="type" class="form-label">Statut:</label>
                    <select id="type" name="type" class="form-control" v-model="typeStatut">
                        <option value="">Tous</option>
                        <option value="pending">En Attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="cancelled">Annulée</option>
                    </select>
                </div>
                <div class="ms-3">
                    <button type="submit" class="btn btn-primary me-3" @click="submitFormFiltre">Rechercher</button>
                    <button type="button" id="btn-reset" class="btn btn-danger"
                        @click="resetFiltre">Réinitialiser</button>
                </div>
            </div>
        </form>
    </div>
    <div class="container mt-3 overflow-scroll">
        <p v-if="isLoading" class="d-block">Chargement en cours...</p>
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Client</th>
                    <th>Emplacement</th>
                    <th>Arrivée</th>
                    <th>Départ</th>
                    <th>Personnes</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="reservations.length === 0">
                    <td>Aucune réservations...</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td class="text-end">--</td>
                </tr>
                <tr v-for="(item, index) in reservations" :key="index">
                    <td>{{ item.user.firstName }} {{ item.user.lastName }}</td>
                    <td>{{ item.campsite.name }}</td>
                    <td>{{ new Date(item.startDate).toLocaleDateString('fr-ca') }}</td>
                    <td>{{ new Date(item.endDate).toLocaleDateString('fr-ca') }}</td>
                    <td>{{ item.guests }}</td>
                    <td>{{ item.totalPrice }}$</td>
                    <td>
                        <span class="badge" :class="store.classeStatus(item.status)">
                            {{ item.status }}
                        </span>
                    </td>
                    <td class="text-end">
                        <RouterLink class="btn btn-sm btn-outline-secondary me-1"
                            :to="{ name: 'ReservationDetails', params: { id: item._id } }">Détails</RouterLink>
                        <button v-if="item.status !== 'cancelled'"
                            @click="modifierStatutReservation('cancelled', item._id)"
                            class="btn btn-sm btn-outline-danger me-1">Annuler</button>
                        <button v-if="item.status === 'pending'"
                            @click="modifierStatutReservation('confirmed', item._id)"
                            class="btn btn-sm btn-outline-primary">Confirmer</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useReservationStore } from '@/stores/reservations.js';
import { storeToRefs } from 'pinia';

const store = useReservationStore();
const {
    isLoading,
    reservations,
    typeStatut
} = storeToRefs(store);

async function modifierStatutReservation(nouveauStatut, id) {
    await store.patchReservationStatutFromList(nouveauStatut, id);
}

/**
 * Vider la variable de filtre
 */
async function resetFiltre() {
    typeStatut.value = '';
    await store.getReservations();
}

/**
 * Filtrer les données
 */
async function submitFormFiltre() {
    await store.getReservationsFiltre();
}

onMounted(async () => {
    await store.getReservations();
})
</script>