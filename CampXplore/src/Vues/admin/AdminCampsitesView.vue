<template>
    <div class="d-flex justify-content-between align-items-end">

        <h1>Gestion des emplacements</h1>
        <div>
            <button type="button" class="btn btn-sm btn-primary me-1 p-2" data-bs-toggle="modal"
                :data-bs-target="'#addNewModal'"
                @click="campsiteTemp = { amenities: [], pricePerNight: 0, capacity: 0 }">Ajouter</button>
            <div class="modal fade" :id="'addNewModal'" tabindex="-1" aria-labelledby="addModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h2 class="modal-title" id="addModalLabel">Ajouter un emplacement</h2>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="ajouterEmplacement">
                                <div class="row mb-3">
                                    <div class="col-md-6 text-start">
                                        <label for="ajouterName" class="form-label">Nom *</label>
                                        <input for="ajouterName" id="ajouterName" type="text" class="form-control"
                                            v-model="campsiteTemp.name" />
                                        <span v-show="validationErrors.includes('name')" class="text-danger">Le
                                            nom est requis</span>
                                        <span v-show="campingExisteDeja || campingExisteDejaValClient"
                                            class="text-danger">Le
                                            nom et le lieu appartient déjà à un autre emplacement</span>
                                    </div>
                                    <div class="col-md-6 text-start">
                                        <label for="ajouterLieu" class="form-label">Lieu *</label>
                                        <input for="ajouterLieu" id="ajouterLieu" type="text" class="form-control"
                                            v-model="campsiteTemp.location" />
                                        <span v-show="validationErrors.includes('location')" class="text-danger">Le lieu
                                            est
                                            requis</span>
                                        <span v-show="campingExisteDeja || campingExisteDejaValClient"
                                            class="text-danger">Le
                                            nom et le lieu appartient déjà à un autre emplacement</span>
                                    </div>
                                </div>
                                <div class="mb-3 text-start">
                                    <label for="ajouterDesc" class="form-label">Description</label>
                                    <textarea for="ajouterDesc" id="ajouterDesc" class="form-control" rows="3"
                                        v-model="campsiteTemp.description"></textarea>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4 text-start">
                                        <label for="ajouterType" class="form-label">Type *</label>
                                        <select for="ajouterType" id="ajouterType" class="form-select"
                                            v-model="campsiteTemp.type">
                                            <option value="tente">Tente</option>
                                            <option value="vr">Vr</option>
                                            <option value="arrière-pays">Arrière-pays</option>
                                            <option value="glamping">glamping</option>
                                            <option value="chalet">chalet</option>
                                        </select>
                                        <span v-show="validationErrors.includes('type')" class="text-danger">Le
                                            type est requis</span>
                                    </div>
                                    <div class="col-md-4 text-start">
                                        <label for="ajouterPpn" class="form-label">Prix par nuit
                                            ($)*</label>
                                        <input for="ajouterPpn" id="ajouterPpn" type="number" class="form-control"
                                            v-model="campsiteTemp.pricePerNight" />
                                        <span v-show="validationErrors.includes('pricePerNight')" class="text-danger">Le
                                            prix par nuit doit être suppérieur ou
                                            égale à 0</span>
                                    </div>
                                    <div class="col-md-4 text-start">
                                        <label for="ajouterCapacite" class="form-label">Capacité(personnes)
                                            *</label>
                                        <input for="ajouterCapacite" id="ajouterCapacite" type="number"
                                            class="form-control" v-model="campsiteTemp.capacity" />
                                        <span v-show="validationErrors.includes('capacity')" class="text-danger">La
                                            capacité
                                            doit être suppérieur ou égale à
                                            1</span>
                                    </div>
                                </div>
                                <div v-if="campsiteTemp.type === 'vr'" class="text-start">
                                    <label for="ajouterCarLength" class="form-label">Longuer du véhicule
                                        *</label>
                                    <input for="ajouterCarLength" id="ajouterCarLength" type="number"
                                        class="form-control" v-model="campsiteTemp.maxVehicleLength" />
                                    <span v-show="validationErrors.includes('maxVehicleLength')" class="text-danger">La
                                        longueur du véhicule est requise</span>
                                </div>
                                <div class="mb-3 text-start">
                                    <label class="form-label fw-bold">Équipements</label>
                                    <div class="row">
                                        <div class="col-md-4 mb-2" v-for="equipement in equipements" :key="equipement">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" :id="equipement"
                                                    :value="equipement" v-model="campsiteTemp.amenities" />
                                                <label class="form-check-label" :for="equipement">{{
                                                    equipement}}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button v-if="isFormValid && !campingExisteDeja && !campingExisteDejaValClient"
                                type="button" class="btn btn-success" data-bs-dismiss="modal"
                                @click="ajouterEmplacement">Enregistrer</button>
                            <button v-else type="button" class="btn btn-success"
                                @click="ajouterEmplacement">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
                        <button type="button" class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal"
                            :data-bs-target="'#modifyModal' + index"
                            @click="campsiteTemp = { ...item }">Modifier</button>
                        <div class="modal fade" :id="'modifyModal' + index" tabindex="-1"
                            aria-labelledby="modifyModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header bg-success text-white">
                                        <h2 class="modal-title" id="modifyModalLabel">Modifier un emplacement</h2>
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form @submit.prevent="modifierEmplacement">
                                            <div class="row mb-3">
                                                <div class="col-md-6 text-start">
                                                    <label for="modifierName" class="form-label">Nom *</label>
                                                    <input for="modifierName" id="modifierName" type="text"
                                                        class="form-control" v-model="campsiteTemp.name" />
                                                    <span v-show="validationErrors.includes('name')"
                                                        class="text-danger">Le
                                                        nom est requis</span>
                                                    <span v-show="campingExisteDeja || campingExisteDejaValClient"
                                                        class="text-danger">Le
                                                        nom et le lieu appartient déjà à un autre emplacement</span>
                                                </div>
                                                <div class="col-md-6 text-start">
                                                    <label for="modifierLieu" class="form-label">Lieu *</label>
                                                    <input for="modifierLieu" id="modifierLieu" type="text"
                                                        class="form-control" v-model="campsiteTemp.location" />
                                                    <span v-show="validationErrors.includes('location')"
                                                        class="text-danger">Le lieu est requis</span>
                                                    <span v-show="campingExisteDeja || campingExisteDejaValClient"
                                                        class="text-danger">Le
                                                        nom et le lieu appartient déjà à un autre emplacement</span>
                                                </div>
                                            </div>
                                            <div class="mb-3 text-start">
                                                <label for="modifierDesc" class="form-label">Description</label>
                                                <textarea for="modifierDesc" id="modifierDesc" class="form-control"
                                                    rows="3" v-model="campsiteTemp.description"></textarea>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-4 text-start">
                                                    <label for="modifierType" class="form-label">Type *</label>
                                                    <select for="modifierType" id="modifierType" class="form-select"
                                                        v-model="campsiteTemp.type">
                                                        <option value="tente">Tente</option>
                                                        <option value="vr">Vr</option>
                                                        <option value="arrière-pays">Arrière-pays</option>
                                                        <option value="glamping">glamping</option>
                                                        <option value="chalet">chalet</option>
                                                    </select>
                                                    <span v-show="validationErrors.includes('type')"
                                                        class="text-danger">Le
                                                        type est requis</span>
                                                </div>
                                                <div class="col-md-4 text-start">
                                                    <label for="modifierPpn" class="form-label">Prix par nuit
                                                        ($)*</label>
                                                    <input for="modifierPpn" id="modifierPpn" type="number"
                                                        class="form-control" v-model="campsiteTemp.pricePerNight" />
                                                    <span v-show="validationErrors.includes('pricePerNight')"
                                                        class="text-danger">Le prix par nuit doit être suppérieur ou
                                                        égale à 0</span>
                                                </div>
                                                <div class="col-md-4 text-start">
                                                    <label for="modifierCapacite" class="form-label">Capacité(personnes)
                                                        *</label>
                                                    <input for="modifierCapacite" id="modifierCapacite" type="number"
                                                        class="form-control" v-model="campsiteTemp.capacity" />
                                                    <span v-show="validationErrors.includes('capacity')"
                                                        class="text-danger">La capacité doit être suppérieur ou égale à
                                                        1</span>
                                                </div>
                                            </div>
                                            <div v-if="campsiteTemp.type === 'vr'" class="text-start">
                                                <label for="modifierCarLength" class="form-label">Longuer du véhicule
                                                    *</label>
                                                <input for="modifierCarLength" id="modifierCarLength" type="number"
                                                    class="form-control" v-model="campsiteTemp.maxVehicleLength" />
                                                <span v-show="validationErrors.includes('maxVehicleLength')"
                                                    class="text-danger">La longueur du véhicule est requise</span>
                                            </div>
                                            <div class="mb-3 text-start">
                                                <label class="form-label fw-bold">Équipements</label>
                                                <div class="row">
                                                    <div class="col-md-4 mb-2" v-for="equipement in equipements"
                                                        :key="equipement">
                                                        <div class="form-check">
                                                            <input :for="equipement" class="form-check-input"
                                                                type="checkbox" :id="equipement" :value="equipement"
                                                                v-model="campsiteTemp.amenities" />
                                                            <label class="form-check-label" :for="equipement">{{
                                                                equipement }}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Annuler</button>
                                        <button v-if="isFormValid && !campingExisteDeja && !campingExisteDejaValClient"
                                            type="button" class="btn btn-success" data-bs-dismiss="modal"
                                            @click="modifierEmplacement(item._id, index)">Enregistrer</button>
                                        <button v-else type="button" class="btn btn-success"
                                            @click="modifierEmplacement(item._id, index)">Enregistrer</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal"
                            :data-bs-target="'#deleteModal' + index">Supprimer</button>
                        <div class="modal fade" :id="'deleteModal' + index" tabindex="-1"
                            aria-labelledby="deleteModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">

                                    <div class="modal-header">
                                        <h2 class="modal-title" id="deleteModalLabel">Confirmer la supression</h2>

                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Voulez-vous vraiment supprimer ce campsite?</p>
                                        <p class="text-danger">{{ item.name }} - {{ item.location }}</p>
                                    </div>
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
import { ref, onMounted, computed } from 'vue';
import { useCampsitesStore } from '@/stores/campsites.js';
import { storeToRefs } from 'pinia';

const store = useCampsitesStore();
const {
    isLoading,
    campsites,
    campingExisteDeja
} = storeToRefs(store);

/**
 * Liste des équipements disponnibles 
 */
const equipements = [
    "électricité",
    "eau",
    "égout",
    "feu de camp",
    "table de pique-nique",
    "abri",
    "wifi",
    "douche",
    "toilettes"
];

/**
 * Valide dynamiquement si le formulaire est valide
 */
const isFormValid = computed(() => validationErrors.value.length === 0);

/**
 * Variable temporaire de campsite
 */
const campsiteTemp = ref({});

/**
 * Faire un appel à l'API pour supprimer un emplacement
 * @param id Id de l'emplacement à supprimer
 */
async function supprimerCampsite(id) {
    await store.supprimerUnCampsite(id);
}

/**
 * Faire un appel à l'API pour ajouter un emplacement
 */
async function ajouterEmplacement() {
    if (isFormValid.value) {
        await store.ajouterUnCampsite(campsiteTemp.value);
    }
}

/**
 * Faire un appel à l'API pour modifier un emplacement
 * @param id Id de l'emplacement
 */
async function modifierEmplacement(id) {
    if (isFormValid.value) {
        await store.modifierUnCampsite(id, campsiteTemp.value);
    }
}

/**
 * Valide dynamiquement si un emplacement existe déjà
 */
const campingExisteDejaValClient = computed(() => {
    return (campsites.value || []).some(campsite =>
        campsite._id !== campsiteTemp.value?._id &&
        campsite.name === campsiteTemp.value?.name &&
        campsite.location === campsiteTemp.value?.location
    );
});

/**
 * Valide s'il y a des erreurs en temps réel
 */
const validationErrors = computed(() => {
    const errors = [];

    if (!campsiteTemp.value?.name?.length) { errors.push("name"); }

    if (!campsiteTemp.value?.location?.length) { errors.push("location"); }

    if (!campsiteTemp.value?.type) { errors.push("type"); }

    if (campsiteTemp.value?.pricePerNight < 0) { errors.push("pricePerNight"); }

    if (campsiteTemp.value?.capacity < 1) { errors.push("capacity"); }

    if (campsiteTemp.value?.type === "vr" &&
        (!campsiteTemp.value?.maxVehicleLength || campsiteTemp.value.maxVehicleLength < 1)) {
        errors.push("maxVehicleLength");
    }

    return errors;
});

onMounted(async () => {
    await store.getCampsites();
})
</script>