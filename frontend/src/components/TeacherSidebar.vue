<template>
  <div class="sidebar bg-light d-flex flex-column">
    <h2 class="text-success fs-4 fw-bold py-4"><i class="px-3 bi bi-mortarboard-fill"></i>School MS</h2>

    <div class="d-flex flex-column flex-grow-1 overflow-auto pt-2">
    
    <router-link to="/teacher" class="link-style" 
    active-class="bg-success bg-opacity-75 text-white fw-bold">
    <i class="bi bi-speedometer2 px-3"></i>Dashboard</router-link >
      <hr class="m-0 border-1 border-secondary border-opacity-75">


    <router-link to="/test/list" class="link-style" 
   :class="{'bg-success text-white fw-bold':route.path.startsWith('/test')}">
    <i class="bi bi-pencil-square px-3"></i>
    Tests</router-link>
    <hr class="m-0 border-1 border-secondary border-opacity-75">

    
    </div>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";


const route = useRoute();

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  router.push("/");
}
</script>


