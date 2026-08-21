        <template>

       
            
            <div class="sidebar bg-light d-flex flex-column">
                <h2 class="text-success  fs-4 fw-bold py-4"><i class="bi bi-mortarboard-fill px-3"></i>SCHOOL MS</h2>

                <div class="d-flex flex-column flex-grow-1 overflow-auto pt-2 ">
                
                <router-link to="/admin" class="link-style" active-class="bg-success  fw-bold text-white" >
                <i class="bi bi-speedometer2  px-3  " ></i>Dashboard</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                <router-link to="/teacher/list" class="link-style" active-class="bg-success text-white fw-bold"> 
                <i class="bi bi-person-workspace px-3"></i>Teachers</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                
                <router-link to="/student/list" class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/student')}" > 
                <i class="bi bi-mortarboard-fill px-3"></i>Students</router-link>
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


                <router-link to="/fees/Dashboard"  class="link-style" :class="{'bg-success text-white fw-bold':route.path.startsWith('/fees')}">
                <i class="bi bi-cash-stack px-3"></i>Fees</router-link>
                <hr class="m-0 border-1 border-secondary border-opacity-75 ">

                
                
                </div>
     
            </div>   

            </template>


        <script setup>

        import { useRoute } from 'vue-router';

        const route = useRoute();

    
        </script>

        <style>

        .link-style{
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
