<template>
  <NavBar/>
  <section class="container">
    <router-view/>
  </section>
</template>

<script setup>
  import NavBar from './components/NavBar.vue';
</script>

<style scoped></style>
