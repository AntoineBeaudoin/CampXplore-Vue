<template>
    <nav class="navbar navbar-expand-lg bg-success mh-4">
        <div class="container">
            <router-link to="/" class="navbar-brand ms-3">CampXplore</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarMenu">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item me-3">
                        <router-link to="/campsites" class="navbar-brand ms-3">Campsites</router-link>
                    </li>
                    <li class="nav-item me-3">
                        <router-link to="/" class="navbar-brand ms-3">AutreLien</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>