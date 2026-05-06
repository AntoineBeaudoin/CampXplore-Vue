<template>
    <nav class="navbar navbar-expand-lg bg-success mb-4">
        <div class="container">
            <router-link to="/" class="navbar-brand ms-3"><strong>CampXplore</strong></router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarMenu">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item me-3">
                        <router-link to="/campsites" class="nav-link ms-3">Campsites</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="!isUserConnexionValid">
                        <router-link :to="{name: 'register'}" class="nav-link">S'inscrire</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="!isUserConnexionValid">
                        <router-link :to="{name: 'login'}" class="nav-link">Connexion</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="isUserConnexionValid">
                        <router-link :to="{name: 'profile'}" class="nav-link">Profile</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="isUserConnexionValid">
                        <router-link :to="{name: 'reservations'}" class="nav-link">Mes Réservations</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="isUserConnexionValid">
                        <a href="#" @click="logout" class="nav-link">Déconnexion</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script setup>
    import { computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
    import { useRoute } from 'vue-router';
    import { useAuthStore } from '@/stores/auth.js';
    import { storeToRefs } from 'pinia';
    import { jwtDecode } from "jwt-decode";

    const store = useAuthStore();
    const {
        email,
        prenom,
        nom,
        telephone, 
        role,
        pwd,
        currentPassword,
        successMessage
    } = storeToRefs(store);

    const tokenRef = ref(getToken());

    const isLogged = computed(() => tokenRef.value)
    const route = useRoute();

    watch(route, () => {
        tokenRef.value = getToken();
    });

    function getToken(){
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
        successMessage.value = "Déconnexion effectué avec succès";
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
    function handleStorage(e){
        if (e.key === 'jwt'){
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
    const isUserConnexionValid = computed(() =>{
        if (isLogged.value && isTokenValid()){
            return true;
        }
        return false;
    })
</script>

<style scoped>
a.router-link-active,
a.router-link-extract-active{
    color: #013a91 !important;
    text-decoration: underline;
}

</style>