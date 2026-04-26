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
                    <li class="nav-item me-3">
                        <router-link to="/" class="nav-link ms-3">AutreLien</router-link>
                    </li>
                    <li class="nav-item me-3" v-if="!isLogged">
                        <router-link :to="{name: 'login'}" class="nav-link">Connexion</router-link>
                    </li>
                    <li class="nav-item me-3" v-else>
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
    const tokenRef = ref(getToken());

    const isLogged = computed(() => tokenRef.value)
    const route = useRoute();

    watch(route, () => {
        tokenRef.value = getToken();
    });

    function getToken(){
        return localStorage.getItem('token');
    };

    function logout() {
        localStorage.removeItem('token');
        tokenRef.value = null;
    };

    onMounted(() => {
        window.addEventListener("storage", handleStorage);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("storage", handleStorage)
    });

    function handleStorage(e){
        if (e.key === 'token'){
            tokenRef.value = getToken();
        }
    };
</script>

<style scoped>
a.router-link-active,
a.router-link-extract-active{
    color: #013a91 !important;
    text-decoration: underline;
}

</style>