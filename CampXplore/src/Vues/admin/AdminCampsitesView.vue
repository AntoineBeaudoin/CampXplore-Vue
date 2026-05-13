<template>
    <h1>Gestion des emplacements</h1>
    <div class="container mt-3 overflow-scroll">
        <p v-if="isLoading" class="d-block">Chargement en cours...</p>
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Nom</th>
                    <th>Lieu</th>
                    <th>Type</th>
                    <th>Prix/Nuits</th>
                    <th>Capacité</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="campsites.length === 0">
                    <td>Aucun campsites...</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td class="text-end">--</td>
                </tr>
                <tr v-for="(item, index) in campsites" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.location }}</td>
                    <td>
                        <span class="badge bg-info text-black">
                            {{ item.type }}
                        </span>
                    </td>
                    <td>{{ item.pricePerNight }}$</td>
                    <td>{{ item.capacity }}</td>
                    <td class="text-end">
                        <RouterLink class="btn btn-sm btn-outline-primary me-1"
                            :to="{ name: 'ReservationDetails', params: { id: item._id } }">Modifier</RouterLink>
                        <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal"
                            data-bs-target="#deleteModal">Supprimer</button>

                        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel"
                            aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">

                                    <div class="modal-header">
                                        <h5 class="modal-title" id="deleteModalLabel">Confirmer la supression</h5>

                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">Voulez-vous vraiment supprimer ce campsite?</div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Annuler</button>

                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                            @click="supprimerCampsite(item._id)">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCampsitesStore } from '@/stores/campsites.js';
import { storeToRefs } from 'pinia';

const store = useCampsitesStore();
const {
    isLoading,
    campsites,
} = storeToRefs(store);

async function supprimerCampsite(id) {
    await store.supprimerUnCampsite(id);
}

onMounted(() => {
    campsites.value = store.getCampsites();
})
</script>