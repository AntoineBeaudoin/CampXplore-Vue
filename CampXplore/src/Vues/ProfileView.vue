<template>
    <h1>Mon profile</h1>
    <AlertMessage :message="errorMessage" :es-succees="messageEsSuccees"/>
    <AlertMessage :message="successMessage" :es-succees="messageEsSuccees"/>
    <section class="row">
        <div class="col-md-6">
            <form id="formulaire-Profile" class="row col-md-6 border border-black rounded-3 border-3 w-100 my-3 p-3" @submit.prevent="">
                <div class="col-12 mb-3">
                    <div>
                        <label for="email" class="form-label">Courriel:</label>
                        <input type="email" id="courriel" name="email" class="form-control" v-model.trim="email" disabled>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div>
                        <label for="prenom" class="form-label">Prénom:</label>
                        <input type="text" id="prenom" name="prenom" class="form-control" v-model.trim="prenom">
                        <div v-if="prenomErrorMessage" class="text-danger">{{ prenomErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div>
                        <label for="nom" class="form-label">Nom:</label>
                        <input type="text" id="nom" name="nom" class="form-control" v-model.trim="nom">
                        <div v-if="nomErrorMessage" class="text-danger">{{ nomErrorMessage }}</div>
                    </div>
                </div> 
                <div class="col-12 col-lg-9 mt-3">
                    <div>
                        <label for="telephone" class="form-label">Numéro de téléphone:</label>
                        <input type="text" id="telephone" name="telephone" class="form-control" v-model.trim="telephone">
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
                        <button type="submit" class="btn btn-primary" @click="submitFormProfile">Enregistrer</button>
                        <button type="button" id="btn-reset" class="btn btn-danger" @click="resetFormProfile">Réinitialiser</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-md-6">
            <form id="formulaire-maj-pwd" class="row border border-black rounded-3 border-3 w-100 my-3 p-3" @submit.prevent="">
                <div class="col-12">
                    <div>
                        <label for="currentPassword" class="form-label">Mot de passe courrant:</label>
                        <input type="password" id="currentPassword" name="currentPassword" class="form-control" v-model.trim="currentPassword">
                        <div v-if="currentPasswordErrorMessage" class="text-danger">{{ currentPasswordErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div>
                        <label for="newPassword" class="form-label">Nouveau mot de passe:</label>
                        <input type="password" id="newPassword" name="newPassword" class="form-control" v-model.trim="newPassword">
                        <div v-if="newPasswordErrorMessage" class="text-danger">{{ newPasswordErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-12">
                    <div>
                        <label for="confirmPassword" class="form-label">Confirmer le mot de passe:</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" v-model.trim="confirmPassword">
                        <div v-if="confirmPasswordErrorMessage" class="text-danger">{{ confirmPasswordErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-12 mt-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <button type="submit" class="btn btn-primary" @click="submitFormMdp">Enregistrer</button>
                        <button type="button" id="btn-reset" class="btn btn-danger" @click="resetFormMdp">Réinitialiser</button>
                    </div>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { computed } from 'vue';
import AlertMessage from '@/components/AlertMessage.vue';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useAuthStore();
const {
    email,
    prenom,
    nom,
    telephone, 
    role,
    errorMessage,
    nomErrorMessage,
    prenomErrorMessage,
    telephoneErrorMessage,
    successMessage,
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordErrorMessage,
    newPasswordErrorMessage,
    confirmPasswordErrorMessage
} = storeToRefs(store);

const messageEsSuccees = computed(() => !errorMessage.value);

async function resetFormProfile(){
    await store.getProfile();
    errorMessage.value = "";
    successMessage.value = "";
    nomErrorMessage.value = "";
    prenomErrorMessage.value = "";
    telephoneErrorMessage.value = "";
}

async function submitFormMdp() {
    await store.modifierMdp();
}

async function resetFormMdp(){
    errorMessage.value = "";
    successMessage.value = "";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    currentPasswordErrorMessage.value = "";
    newPasswordErrorMessage.value = "";
    confirmPasswordErrorMessage.value = "";
}

async function submitFormProfile(){
    await store.majProfile();
}

onMounted(() => {
  store.getProfile();
})
</script>