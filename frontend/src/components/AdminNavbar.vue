    <template>

        <div class="row m-0 min-vh-100">

        <div class="col-lg-3 col-xl-2  d-none d-lg-block p-0 m-0 ">
                <Sidebar />
            </div>
    <div class="content col-12  col-lg-9 col-xl-10 p-0 m-0 ">
    <div class="menu bg-white  p-3 position-sticky top-0 px-5 d-md-flex justify-content-md-between align-items-md-center" style="z-index:1000;" >
<button
    class="btn btn-outline-success d-lg-none"
    data-bs-toggle="offcanvas"
    data-bs-target="#mobileSidebar"
>
    <i class="bi bi-list fs-4"></i>
</button>
    <div >
    <p class=" bg-success text-white px-3 py-2 fw-bold rounded-5 text-center">Oxford Public School</p>
    </div>

    <div class="position-relative">
    
      <div class="d-flex align-items-center  gap-2 pointer " @click="showDropdown=!showDropdown">

    <i class="bi bi-person-fill bg-secondary bg-opacity-75 fs-4 p-2 rounded-5 text-white d-flex justify-content-center align-items-center"></i>
    <h2 class="text-capitalize fs-5">{{ name }}</h2>
     <i class="bi bi-caret-down-fill"></i>
   
    </div>


<div v-if="showDropdown" class="position-absolute end-0 mt-3 border shadow bg-white rounded-3">
<div class="d-flex align-items-center justify-content-around bg-light px-5 py-2 gap-3"  >

    <i class="bi bi-person-fill bg-secondary bg-opacity-75 fs-5 p-2 rounded-5 text-white d-flex justify-content-center align-items-center"></i>
    <h2 class="text-capitalize fs-5">{{ name }}</h2>
    <p @click="showDropdown=!showDropdown" class="pointer bg-secondary bg-opacity- rounded-5 px-2 text-white fw-bold position-absolute end-0 me-2">X</p>
    
</div>
<div  class="px-3 pt-2">
<p class="m-0 text-secondary ">Email:</p>
<p class="fw-bold">{{ email }}</p>

</div>
<hr class="m-0 p-0 border-secondary">

<div  class="px-3 pt-2">
<p class="m-0 text-secondary ">Role:</p>
<p class="fw-bold text-capitalize">{{ role }}</p>

</div>

<hr class="m-0 p-0 border-secondary">

<div class="py-2 d-flex align-items-center ms-3">
<i class="bi bi-box-arrow-right fs-5"></i>
<button class="btn " @click.prevent="logout()">Logout</button>
</div>


</div>
    </div>
  
    </div>

    <div
    class="offcanvas offcanvas-start"
    tabindex="-1"
    id="mobileSidebar"
>
    <div class="offcanvas-header">
        <h5 class="fw-bold">School MS</h5>

        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
        ></button>
    </div>

    <div class="offcanvas-body p-0">
        <Sidebar />
    </div>
</div>
    <slot></slot>
    </div>
    

        
        </div>


    </template>


    <script setup>
    import {ref} from 'vue';
    import { useRouter,useRoute } from 'vue-router';
    import Sidebar from './Sidebar.vue';

    const router = useRouter();
    const route=useRoute()

    const getrole = localStorage.getItem("role");
    const role = ref(getrole);

    const getName = localStorage.getItem("name");
    const name = ref(getName);

    const getEmail = localStorage.getItem("email");
    const email = ref(getEmail)

    const showDropdown =ref(false)

   
    const logout = ()=>{
        localStorage.removeItem("token");
            localStorage.removeItem("role");

            router.push("/")
    }
    </script>


    <style >
    /* .layout{
        display: flex;
        justify-content: start;
        align-items: stretch;
        margin:0;
        
    } */
   

    @media(max-width:768px){
        .content{
            margin-left:0;
        }
      
       
    }

    .header {
        display:flex;
        justify-content:space-between;
        align-items:center;
        background-color: rgb(247, 244, 244);
        /* flex:1; */
        padding:30px;
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
        /* position: sticky;
        z-index:1000;
        top:0; */
    
    

    }
    .header  h1{
        font-size:30px;
        color:rgb(97, 32, 19);
        text-transform:capitalize;
        
    }
    .pointer{
        cursor: pointer;
    }


    </style>