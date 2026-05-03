<template>
    <AlertMessage :message="errorMessage" :es-succees="messageEsSuccees" />
    <AlertMessage :message="successMessage" :es-succees="messageEsSuccees" />
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
                <tr v-for="(item, index) in reservations" :key="index">
                    <td>{{ item.campsite.name }}</td>
                    <td>{{ new Date(item.startDate).toLocaleDateString('fr-ca') }}</td>
                    <td>{{ new Date(item.endDate).toLocaleDateString('fr-ca') }}</td>
                    <td>{{ item.guests }}</td>
                    <td>{{ item.totalPrice }}$</td>
                    <td>
                        <span class="badge" :class="classeStatus(item.status)">
                            {{ item.status }}
                        </span>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-1">Détails</button>
                        <button v-if="peutAnnuler(item.status)" class="btn btn-sm btn-outline-danger">Annuler</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import AlertMessage from '@/components/AlertMessage.vue';
import { onMounted } from 'vue';
import { useReservationStore } from '@/stores/reservations.js';
import { storeToRefs } from 'pinia';

const store = useReservationStore();
const {
    isLoading,
    errorMessage,
    reservations,
} = storeToRefs(store);

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

const peutAnnuler = (status) => {
    return status === 'pending';
}

onMounted(() => {
    reservations.value = store.getReservations();
})
</script>