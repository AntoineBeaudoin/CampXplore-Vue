<template>
    <div class="container">
        <div class="border rounded p-3 w-50 m-auto border-3 border-black">
            <div class="text-center">Connexion</div>
            <form @submit.prevent="login" class="mx-auto w-75">
                <div class="mb-3">
                    <label for="email" class="form-label">Courriel</label>
                    <input type="email" id="email" name="email" class="form-control" autocomplete="email" v-model="email"/>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input type="password" id="password" name="password" class="form-control" autocomplete="password" v-model="pwd"/>
                </div>
                <p class="text-danger mb-3">{{ errorMessage }}</p>
                <button type="submit" class="btn btn-primary">Se connecter</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';

const store = useAuthStore();
const { email, pwd, errorMessage } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

async function login() {
    try {
        await store.login();
        if(errorMessage.value === ''){
            const redirectTo = route.query.redirect || '/';
            await router.push(redirectTo);
        }
    }
    catch {
        errorMessage.value = "Erreur de connexion";
    }
}
</script>