<template>
    <h1>Mes réservations</h1>
    <div class="container mt-3 overflow-scroll">
        <p v-if="isLoading" class="d-block">Chargement en cours...</p>
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
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
                    <td>Aucune réservations... <router-link to="/campsites"
                            class=" link-info">trouver des endroits où réserver</router-link></td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td class="text-end">--</td>
                </tr>
                <tr v-for="(item, index) in reservations" :key="index">
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
                        <button v-if="peutAnnuler(item.status)"
                            @click="modifierStatutReservation('cancelled', item._id)"
                            class="btn btn-sm btn-outline-danger">Annuler</button>
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
} = storeToRefs(store);

/**
 * Valide que l'annulation de la réservation est possible
 * @param statut Le statut actuel de la réservation
 */
const peutAnnuler = (statut) => {
    return statut === 'pending';
}

/**
 * Fait un appel à l'API pour modifier le statut de la réservation
 * @param nouveauStatut Le nouveau statut de la réservation
 * @param id L'id de la réservation à modifier
 */
async function modifierStatutReservation(nouveauStatut, id) {
    await store.patchReservationStatutFromList(nouveauStatut, id);
}

onMounted(() => {
    reservations.value = store.getReservations();
})
</script>