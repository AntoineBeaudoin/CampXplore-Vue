<template>
    <div class="container">
        <div class="border rounded p-3 w-50">
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
    import {ref} from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    const API_BASE = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const route = useRoute();
    const router = useRouter();
    const email = ref('');
    const pwd = ref('');
    const errorMessage = ref('');

    async function login() {
        try {
            const resp = await fetch( API_BASE + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json', 
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({email: email.value, password: pwd.value})
            });
            const data = await resp.json();
            if (!resp.ok){
                errorMessage.value = "Nom d'utilisateur ou mot de passe non valide";
            }
            else{
                localStorage.setItem('token', data.token);
                const redirectTo = route.query.redirect || '/';
                router.push(redirectTo);
            }
        } catch (err) {
            errorMessage.value = "Erreur de connexion";
            console.log("Err ", err);
        }
    }
</script>