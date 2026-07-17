    <template >
    

        
        <div class=" col-md-2 h-100  d-flex flex-column m-0 position-fixed text-white" style=" background-color: rgb(156, 157, 158); z-index:1000">
    <h2 class="p-3 py-4 fw-bold">School MS</h2>

    <router-link to="/teacher" class="text-decoration-none text-white fs-4 p-3 fw-bold">Dashboard</router-link>
    <router-link to="/testlist"  class="text-decoration-none text-white fs-4 p-3 fw-bold">Tests</router-link>
    <button class="btn btn-danger mt-auto mb-4 m-3" @click.prevent="logout">Logout</button>



        </div>
    
    

        </template>


    <script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        router.push("/")
    }
    
    </script>