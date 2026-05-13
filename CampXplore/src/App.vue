<template>
  <NavBar/>
  <section class="container">
    <AlertMessage/>
    <router-view/>
  </section>
  <footer class="bg-black text-light mt-5 py-3">
    <p class="text-center m-0">CampXplore © 2026</p>
  </footer>
</template>

<script setup>
  import NavBar from './components/NavBar.vue';
  import AlertMessage from './components/AlertMessage.vue';
</script>

<style scoped></style>
