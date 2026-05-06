<template>
  <NavBar/>
  <section class="container">
    <router-view/>
  </section>
  <footer class="bg-black text-light mt-5 py-3">
    <p class="text-center m-0">CampXplore © 2026</p>
  </footer>
</template>

<script setup>
  import NavBar from './components/NavBar.vue';
</script>

<style scoped></style>
