<template>
    <h1>Mon profile</h1>
    <section class="row">
        <div class="col-md-6">
            <section class="col-md-6 border border-black rounded-3 border-3 w-100 my-3 p-3">
                <h2 class="border-bottom pb-2 mb-3">Informations personnelles</h2>
                <form id="formulaire-Profile" class="row" @submit.prevent="">
                    <div class="col-12 mb-3">
                        <div>
                            <label for="email" class="form-label">Courriel:</label>
                            <input type="email" id="courriel" name="email" class="form-control" v-model.trim="email"
                                disabled>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div>
                            <label for="prenom" class="form-label">Prénom:</label>
                            <input type="text" id="prenom" name="prenom" class="form-control" v-model.trim="tempPrenom">
                            <div v-if="prenomErrorMessage" class="text-danger">{{ prenomErrorMessage }}</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div>
                            <label for="nom" class="form-label">Nom:</label>
                            <input type="text" id="nom" name="nom" class="form-control" v-model.trim="tempNom">
                            <div v-if="nomErrorMessage" class="text-danger">{{ nomErrorMessage }}</div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-9 mt-3">
                        <div>
                            <label for="telephone" class="form-label">Numéro de téléphone:</label>
                            <input type="text" id="telephone" name="telephone" class="form-control"
                                v-model.trim="tempTelephone">
                            <div v-if="telephoneErrorMessage" class="text-danger">{{ telephoneErrorMessage }}</div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-3 mt-3">
                        <div>
                            <label for="role" class="form-label">Role:</label>
                            <input type="role" id="role" name="role" class="form-control" v-model.trim="role" disabled>
                        </div>
                    </div>
                    <div class="col-12 mt-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <button type="submit" class="btn btn-primary"
                                @click="submitFormProfile">Enregistrer</button>
                            <button type="button" id="btn-reset" class="btn btn-danger"
                                @click="resetFormProfile">Réinitialiser</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
        <div class="col-md-6">
            <section class="border border-black rounded-3 border-3 w-100 my-3 p-3">
                <h2 class="border-bottom pb-2 mb-3">Changer le mot de passe</h2>
                <form id="formulaire-maj-pwd" class="row " @submit.prevent="">
                    <div class="col-12">
                        <div>
                            <label for="currentPassword" class="form-label">Mot de passe courrant:</label>
                            <input type="password" id="currentPassword" name="currentPassword" class="form-control"
                                v-model.trim="currentPassword">
                            <div v-if="currentPasswordErrorMessage" class="text-danger">{{ currentPasswordErrorMessage
                                }}</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div>
                            <label for="newPassword" class="form-label">Nouveau mot de passe:</label>
                            <input type="password" id="newPassword" name="newPassword" class="form-control"
                                v-model.trim="newPassword">
                            <div v-if="newPasswordErrorMessage" class="text-danger">{{ newPasswordErrorMessage }}</div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div>
                            <label for="confirmPassword" class="form-label">Confirmer le mot de passe:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" class="form-control"
                                v-model.trim="confirmPassword">
                            <div v-if="confirmPasswordErrorMessage" class="text-danger">{{ confirmPasswordErrorMessage
                                }}</div>
                        </div>
                    </div>
                    <div class="col-12 mt-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <button type="submit" class="btn btn-primary" @click="submitFormMdp">Modifier le mot de
                                passe</button>
                            <button type="button" id="btn-reset" class="btn btn-danger"
                                @click="resetFormMdp">Réinitialiser</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useAuthStore();
const {
    email,
    role,
    nomErrorMessage,
    prenomErrorMessage,
    telephoneErrorMessage,
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordErrorMessage,
    newPasswordErrorMessage,
    confirmPasswordErrorMessage,
    tempPrenom,
    tempNom,
    tempTelephone
} = storeToRefs(store);

/**
 * Remet à l'état initiale le formulaire de modification du mot de passe
 */
async function resetFormMdp() {
    store.resetModificationMdp();
}

/**
 * Appel l'API pour modifier le mot de passe
 */
async function submitFormMdp() {
    await store.modifierMdp();
}

/**
 * Remet à l'état initiale le formulaire de modification du profile
 */
async function resetFormProfile() {
    await store.getProfile();
    store.resetChampsErreur();
}

/**
 * Appel l'API pour modifier les informations du compte
 */
async function submitFormProfile() {
    await store.majProfile();
}

onMounted(async () => {
    await store.getProfile();
})
</script>