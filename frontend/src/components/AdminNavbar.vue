<template>

    <div class="layout">

   
<sidebar/>
<div class="content">
  <div class="header">

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
.layout{
    display: flex;
    justify-content: start;
    align-items: stretch;
    
    
}
.content{
    flex: 1;
    margin-left: 230px;;
}
.header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    background-color: rgb(247, 244, 244);
     flex:1;
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