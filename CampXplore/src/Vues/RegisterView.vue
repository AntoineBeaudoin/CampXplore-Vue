<template>
    <h1>S'inscrire</h1>
    <form id="formulaire-Register" class="mb-4" @submit.prevent="">
        <div class="row">
            <div class="col-md-3 p-3">
                <div>
                    <label for="prenom" class="form-label">Prénom:</label>
                    <input type="text" id="prenom" name="prenom" class="form-control" v-model.trim="prenom">
                    <div v-if="prenomErrorMessage" class="text-danger">{{ prenomErrorMessage }}</div>
                </div>
            </div>
            <div class="col-md-3 p-3">
                <div>
                    <label for="nom" class="form-label">Nom:</label>
                    <input type="text" id="nom" name="nom" class="form-control" v-model.trim="nom">
                    <div v-if="nomErrorMessage" class="text-danger">{{ nomErrorMessage }}</div>
                </div>
            </div>
            <div class="col-md-3 p-3">
                <div>
                    <label for="email" class="form-label">Courriel:</label>
                    <input type="email" id="courriel" name="email" class="form-control" v-model.trim="email">
                    <div v-if="emailErrorMessage" class="text-danger">{{ emailErrorMessage }}</div>
                </div>
            </div>
            <div class="col-md-3 p-3">
                <div>
                    <label for="telephone" class="form-label">Numéro de téléphone:</label>
                    <input type="text" id="telephone" name="telephone" class="form-control" v-model.trim="telephone">
                    <div v-if="telephoneErrorMessage" class="text-danger">{{ telephoneErrorMessage }}</div>
                </div>
            </div>
            <div class="col-md-3 p-3">
                <div>
                    <label for="pwd" class="form-label">Mot de passe:</label>
                    <input type="password" id="pwd" name="pwd" class="form-control" v-model.trim="pwd">
                    <div v-if="pwdErrorMessage" class="text-danger">{{ pwdErrorMessage }}</div>
                </div>
            </div>
            <div class="col-md-3 p-3">
                <div>
                    <label for="pwdC" class="form-label">Confimation du mot de passe:</label>
                    <input type="password" id="pwdC" name="pwdC" class="form-control" v-model.trim="pwdC">
                    <div v-if="pwdCErrorMessage" class="text-danger">{{ pwdCErrorMessage }}</div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
            <button type="submit" class="btn btn-primary" @click="submitForm">Rechercher</button>
            <button type="button" id="btn-reset" class="btn btn-danger" @click="resetForm">Réinitialiser</button>
        </div>
    </form>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useAuthStore();
const {
    email,
    pwd,
    prenom,
    nom,
    telephone,
    pwdC,
    prenomErrorMessage,
    nomErrorMessage,
    emailErrorMessage,
    telephoneErrorMessage,
    pwdErrorMessage,
    pwdCErrorMessage,
} = storeToRefs(store);

const resetForm = async () => {
    prenom.value = '';
    nom.value = '';
    email.value = '';
    email.value = '';
    telephone.value = '';
    pwd.value = '';
    pwdC.value = '';
}

async function submitForm() {
    await store.register();
}
</script>