<template>
    <div class="mb-4 border border-3 rounded-3 p-3 w-50 m-auto">
        <h1 class="text-center border-bottom pb-2">S'inscrire</h1>
        <form id="formulaire-Register" @submit.prevent="" novalidate="">
            <div class="row">
                <div class="col-lg-6 p-3">
                    <div>
                        <label for="prenom" class="form-label">Prénom:</label>
                        <input type="text" id="prenom" name="prenom" class="form-control" v-model.trim="prenom">
                        <div v-if="prenomErrorMessage" class="text-danger">{{ prenomErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-lg-6 p-3">
                    <div>
                        <label for="nom" class="form-label">Nom:</label>
                        <input type="text" id="nom" name="nom" class="form-control" v-model.trim="nom">
                        <div v-if="nomErrorMessage" class="text-danger">{{ nomErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-lg-12 p-3">
                    <div>
                        <label for="email" class="form-label">Courriel:</label>
                        <input type="email" id="courriel" name="email" class="form-control" v-model.trim="email">
                        <div v-if="emailErrorMessage" class="text-danger">{{ emailErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-lg-12 p-3">
                    <div>
                        <label for="telephone" class="form-label">Numéro de téléphone:</label>
                        <input type="text" id="telephone" name="telephone" class="form-control"
                            v-model.trim="telephone">
                        <div v-if="telephoneErrorMessage" class="text-danger">{{ telephoneErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-lg-6 p-3">
                    <div>
                        <label for="pwd" class="form-label">Mot de passe:</label>
                        <input type="password" id="pwd" name="pwd" class="form-control" v-model.trim="pwd">
                        <div v-if="pwdErrorMessage" class="text-danger">{{ pwdErrorMessage }}</div>
                    </div>
                </div>
                <div class="col-lg-6 p-3">
                    <div>
                        <label for="pwdC" class="form-label">Confimation du mot de passe:</label>
                        <input type="password" id="pwdC" name="pwdC" class="form-control" v-model.trim="pwdC">
                        <div v-if="pwdCErrorMessage" class="text-danger">{{ pwdCErrorMessage }}</div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap">
                <button type="submit" class="btn btn-primary" @click="submitForm">S'inscrire</button>
                <button type="button" id="btn-reset" class="btn btn-danger" @click="resetForm">Réinitialiser</button>
            </div>
        </form>
        <div class="d-flex justify-content-center mt-3 border-top pt-3">
            <p class="d-inline-block pe-2 mb-0">Déjà un compte? </p>
            <router-link :to="{ name: 'login' }" class="link-primary d-inline-block mb-0">Se connecter</router-link>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";

const router = useRouter();

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

/**
 * Vide le formulaire
 */
const resetForm = () => {
    store.resetRegisterForm();
}

/**
 * Envoie le formulaire
 */
async function submitForm() {
    if (await store.register()) {
        setTimeout(() => {
            router.push({ name: "login" });
        }, 2000);
    }
}
</script>