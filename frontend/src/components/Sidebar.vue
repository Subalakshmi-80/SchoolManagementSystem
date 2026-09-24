        <template>

       
            
            <div class="sidebar bg-light d-flex flex-column">
                <h2 class="text-success  fs-4 fw-bold py-4"><i class="bi bi-mortarboard-fill px-3"></i>SCHOOL MS</h2>

                <div class="d-flex flex-column flex-grow-1 overflow-auto pt-2 ">
                
                <router-link to="/admin" class="link-style" active-class="bg-success  fw-bold text-white" >
                <i class="bi bi-speedometer2  px-3  " ></i>Dashboard</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                <router-link to="/teacher/list" class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/teacher')}"> 
                <i class="bi bi-person-workspace px-3"></i>Teachers</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                
                <router-link to="/student/list" class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/student')}" > 
                <i class="bi bi-mortarboard-fill px-3"></i>Students</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                <router-link to="/admin/testlist" class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/admin/test')}" > 
                <i class="bi bi-mortarboard-fill px-3"></i>Tests</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">


                <router-link to="/standard/list"  class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/standard')}" >
                <i class="bi bi-book px-3"></i>Standards</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">


                <router-link to="/class/list"  class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/class')}">
                <i class="bi bi-building-fill px-3"></i>Class</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">


                <router-link to="/subject/list"  class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/subject')}">
                <i class="bi bi-journal-bookmark px-3"></i>Subjects</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">


                <router-link to="/timetable/list"  class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/timetable')}">
                <i class="bi bi-calendar2-check-fill px-3"></i>Timetable</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                <div class="link-style"
                   
                    @click="feesOpen = !feesOpen">

                    <i class="bi bi-cash-stack px-3"></i>Fees
                    <i class="bi ms-auto" :class="feesOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"></i>                    
                </div>
                <hr class="m-0 border-1 border-secondary border-opacity-75 "> 

                <div v-if="feesOpen">
                    <router-link
                        to="/fees-structure/list"
                        class="link-style ps-5"
                        :class="{ 'bg-success text-white fw-bold': route.path.startsWith('/fees-structure') }"
                    >
                        <i class="bi bi-list-ul px-2"></i>Fees Structure
                    </router-link>

                    <hr class="m-0 border-1 border-secondary border-opacity-75">


                       <router-link
                        to="/fees/Dashboard"
                        class="link-style ps-5"
                        :class="{ 'bg-success text-white fw-bold': route.path.startsWith('/fees/')}"
                    >
                        <i class="bi bi-bar-chart-line-fill px-2"></i>Fees Dashboard
                    </router-link>

                    <hr class="m-0 border-1 border-secondary border-opacity-75">
                </div>
            

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
<!-- 
    <router-link
        to="/attendance/dashboard"
        class="link-style ps-5"
        :class="{ 'bg-success text-white fw-bold': route.path.startsWith('/attendance/dashboard') }"
    >
        <i class="bi bi-bar-chart-line-fill px-2"></i>Dashboard
    </router-link>

    <hr class="m-0 border-1 border-secondary border-opacity-75"> -->

    <router-link
        to="/school-calendar/list"
        class="link-style ps-5"
        :class="{ 'bg-success text-white fw-bold': route.path.startsWith('/school-calendar') }"
    >
        <i class="bi bi-calendar-event px-2"></i>School Calendar
    </router-link>

    <hr class="m-0 border-1 border-secondary border-opacity-75">

    <router-link
        to="/attendance/list"
        class="link-style ps-5"
        :class="{ 'bg-success text-white fw-bold': route.path.startsWith('/attendance/') }"
    >
        <i class="bi bi-person-check-fill px-2"></i>Attendance
    </router-link>

    <hr class="m-0 border-1 border-secondary border-opacity-75">

</div>


                <router-link to="/academic-year/list" class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/academic-year')}">
                <i class="bi bi-calendar-event px-3"></i>Academic Year
                </router-link>

                <hr class="m-0 border-1 border-secondary border-opacity-75 ">
                
                
                </div>
     
            </div>   

            </template>


        <script setup>

        import { useRoute } from 'vue-router';
        import {ref} from 'vue';

        const route = useRoute();

     const feesOpen = ref(
    
    route.path.startsWith('/fees')
);

const attendanceOpen = ref(
    route.path.startsWith('/attendance') ||
    route.path.startsWith('/school-calendar')
);
        </script>

        <style>

        .link-style{
            display: block;
            text-decoration:none;
            color:black;
            padding:12px;
            font-weight: 500;
        }
        .link-style:hover{
            background-color: rgba(224, 224, 224, 0.747);
        }
        .sidebar{
        position: fixed;
        top: 0;
        left: 0;
        width: 230px;
        height: 100vh;
    }


        </style>
