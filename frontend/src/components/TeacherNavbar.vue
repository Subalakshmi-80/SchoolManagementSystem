<template>

  <div class="d-flex vh-100  " >
  <TeacherSidebar/>
  
  <div class="flex-grow-1" style="margin-left: 210px;">
      <nav class="navbar bg-white shadow position-sticky top-0 start-50 px-4 p-4" >
        <h3 class="m-0 fw-bold text-secondary text-capitalize">Welcome, {{ role }}</h3>
      </nav>
        <div class="p-5 ">
        <slot></slot>
      </div>
  </div>

  </div>
  

</template>


<script setup>
import {ref} from 'vue';
import TeacherSidebar from './TeacherSidebar.vue';


const getrole = localStorage.getItem("role");
const role = ref(getrole);


</script>


