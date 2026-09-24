<template>
  <div class="sidebar bg-light d-flex flex-column">
    <h2 class="text-success fs-4 fw-bold py-4">
      <i class="px-3 bi bi-mortarboard-fill"></i>School MS
    </h2>

    <div class="d-flex flex-column flex-grow-1 overflow-auto pt-2">

      <router-link
        to="/teacher"
        class="link-style"
        active-class="bg-success bg-opacity-75 text-white fw-bold"
      >
        <i class="bi bi-speedometer2 px-3"></i>Dashboard
      </router-link>

      <hr class="m-0 border-1 border-secondary border-opacity-75">

      <router-link
        to="/test/list"
        class="link-style"
        :class="{ 'bg-success text-white fw-bold': route.path.startsWith('/test') }"
      >
        <i class="bi bi-pencil-square px-3"></i>
        Tests
      </router-link>

      <hr class="m-0 border-1 border-secondary border-opacity-75">
      
                <div
                    class="link-style"
                    @click="attendanceOpen = !attendanceOpen"
                >
                    <i class="bi bi-calendar-check px-3"></i>Attendance
                    <i
                        class="bi ms-auto"
                        :class="attendanceOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
                    ></i>
                </div>

<hr class="m-0 border-1 border-secondary border-opacity-75">


      <div v-if="attendanceOpen">

        <router-link
          to="/attendance/summary"
          class="link-style ps-5"
          :class="{
            'bg-success text-white fw-bold':
              route.path.startsWith('/attendance/summary')
          }"
        >
          <i class="bi bi-bar-chart-line-fill px-2"></i>
          Attendance Summary
        </router-link>

        <hr class="m-0 border-1 border-secondary border-opacity-75">
 
       <router-link
          to="/attendance/teacher/list"
          class="link-style ps-5"
          :class="{
            'bg-success text-white fw-bold':
              route.path.startsWith('/attendance/teacher') || 
              route.path.startsWith('/attendance/mark') ||
              route.path.startsWith('/attendance/view')
          }"
        >
          <i class="bi bi-person-check-fill px-2"></i>
          Attendance
        </router-link> 

        <hr class="m-0 border-1 border-secondary border-opacity-75">

      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const attendanceOpen = ref(
  route.path.startsWith("/attendance")
);
</script>