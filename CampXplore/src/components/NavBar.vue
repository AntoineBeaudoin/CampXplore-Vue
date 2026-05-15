<template>
    <nav class="navbar navbar-expand-lg bg-success mb-4">
        <div class="container">
            <div>
                <router-link to="/" class="navbar-brand d-inline-block"><strong>CampXplore</strong></router-link>
                <p v-if="isUserConnexionValid" class="nav-link mb-0 d-inline-block">Bonjours {{ comPrenom }} {{ comNom }}</p>
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarMenu">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item me-3">
                        <router-link to="/campsites" class="nav-link">Emplacements</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="!isUserConnexionValid">
                        <router-link :to="{ name: 'register' }" class="nav-link">S'inscrire</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="!isUserConnexionValid">
                        <router-link :to="{ name: 'login' }"
                            class="nav-link border-black rounded-3 border border-1">Connexion</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="isUserConnexionValid">
                        <router-link :to="{ name: 'profile' }" class="nav-link">Profile</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="isUserConnexionValid">
                        <router-link :to="{ name: 'reservations' }" class="nav-link">Mes Réservations</router-link>
                    </li>
                    <li v-if="store.isUserAdmin()" class="nav-item dropdown me-3">
                        <button class="btn btn-outline-dark dropdown-toggle p-2" type="button" id="dropdownMenuButton"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Admin
                        </button>

                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><router-link :to="{ name: 'AdminCampsites' }" class="dropdown-item">Emplacements</router-link></li>
                            <li><router-link :to="{ name: 'AdminReservations' }" class="dropdown-item">Réservations</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item me-3" v-if="isUserConnexionValid">
                        <a href="#" @click="logout"
                            class="nav-link border-black rounded-3 border border-1 p-2">Déconnexion</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { storeToRefs } from 'pinia';
import { jwtDecode } from "jwt-decode";
import { useAlertStore } from '@/stores/alert.js';

const alertStore = useAlertStore();

const store = useAuthStore();
const {
    email,
    prenom,
    nom,
    telephone,
    role,
    pwd,
    currentPassword,
} = storeToRefs(store);

const tokenRef = ref(getToken());

const isLogged = computed(() => tokenRef.value)
const route = useRoute();

const comPrenom = computed(() => prenom.value);
const comNom = computed(() => nom.value);

watch(route, () => {
    tokenRef.value = getToken();
});

function getToken() {
    return localStorage.getItem('jwt');
};

/**
 * Vide les champs en déconnectant l'utilisateur 
 */
function logout() {
    localStorage.removeItem('jwt');
    tokenRef.value = null;
    email.value = "";
    prenom.value = "";
    nom.value = "";
    telephone.value = "";
    role.value = "";
    currentPassword.value = "";
    pwd.value = "";
    alertStore.success("Déconnexion effectué avec succès");
};

onMounted(() => {
    window.addEventListener("storage", handleStorage);
});

onBeforeUnmount(() => {
    window.removeEventListener("storage", handleStorage)
});

/**
 * Met à jours le token jwt lors d'un changement dans le storage
 * @param e événement dans le storage
 */
function handleStorage(e) {
    if (e.key === 'jwt') {
        tokenRef.value = getToken();
    }
};

/**
 * Valide si le token de l'utilisateur n'est pas expiré 
 */
function isTokenValid() {
    const token = getToken();
    if (!token) return false;
    try {
        const { exp } = jwtDecode(token);
        return Date.now() < exp * 1000;
    } catch {
        return false;
    }
}

/**
 * Variable indiquant si l'utilisateur est connecté en validant si son token est toujours valide
 */
const isUserConnexionValid = computed(() => {
    if (isLogged.value && isTokenValid()) {
        store.getProfile();
        return true;
    }
    return false;
})
</script>

<style scoped>
a.router-link-active,
a.router-link-extract-active {
    color: #013a91 !important;
    text-decoration: underline;
}
</style>