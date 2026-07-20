<template>

    <div class="row m-0 min-vh-100">

   
    <div class="col-lg-3 col-xl-2  d-none d-lg-block p-0 m-0 content side-header" >
            <Sidebar />
        </div>
<div class="content col-12  col-lg-9 col-xl-10 p-0 m-0">
  <div class="header">
   <button class="btn btn-outline-secondary d-lg-none">
            <i class="bi bi-list"></i>
        </button>

     <h1>Welcome, {{ role }}</h1>
     
 </div>
<slot></slot>
</div>
  

     
    </div>


</template>


<script setup>
import {ref} from 'vue';

import Sidebar from './Sidebar.vue';



const getrole = localStorage.getItem("role");
const role = ref(getrole);


</script>


<style scoped>
/* .layout{
    display: flex;
    justify-content: start;
    align-items: stretch;
    margin:0;
    
} */
.content{
    margin-left:230px;
}

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
    position: sticky;
    z-index:1000;
    top:0;
   
   

}
.header  h1{
     font-size:30px;
      color:rgb(97, 32, 19);
      text-transform:capitalize;
    
}


</style>