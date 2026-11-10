<script setup>

  import { onBeforeMount } from 'vue';
  import { useGlobalStore } from './stores/global.js';


  import Navbar from './components/Navbar.vue';



  const { getUserDetails } = useGlobalStore();

  onBeforeMount(() => {
    getUserDetails(localStorage.getItem('token'));
  });
 
</script>

<template>

  <Navbar />
  <router-view />
 
</template>
