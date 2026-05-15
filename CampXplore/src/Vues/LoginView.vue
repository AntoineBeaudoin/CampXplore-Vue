<template>
    <div class="container">
        <div class="border rounded p-3 w-50 m-auto border-black">
            <h1 class="text-center border-bottom pb-2 mb-3">Connexion</h1>
            <form @submit.prevent="login" class="mx-auto w-75" novalidate>
                <div class="mb-3">
                    <label for="email" class="form-label">Courriel</label>
                    <input type="email" id="email" name="email" class="form-control" autocomplete="email"
                        v-model="email" />
                    <div v-if="emailErrorMessage" class="text-danger">{{ emailErrorMessage }}</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input type="password" id="password" name="password" class="form-control" autocomplete="password"
                        v-model="pwd" />
                </div>
                <p class="text-danger mb-3">{{ errorMessage }}</p>
                <button type="submit" class="btn btn-primary w-100">Se connecter</button>
            </form>
            <div class="d-flex justify-content-center mt-3 border-top pt-3 mt-3">
                <p class="d-inline-block pe-2 mb-0">Pas encore de compte? </p>
                <router-link :to="{ name: 'register' }" class="link-primary d-inline-block mb-0">S'inscrire</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useAuthStore();
const { email, pwd, errorMessage, emailErrorMessage } = storeToRefs(store);

const router = useRouter();

async function login() {
    try {
        const connEsSuccees = await store.login();
        if (connEsSuccees && errorMessage.value === '') {
            await router.push('/');
        }
    }
    catch {
        errorMessage.value = "Erreur de connexion";
    }
}
</script>