<template>

    
    <div class="sidebar">
        <h2>School MS</h2>

    <router-link to="/admin">Dashboard</router-link>
           <router-link to="/studentlist">Students</router-link>
            <button @click.prevent="logout">Logout</button>
        
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

<style>

.sidebar{
    width:230px;
   min-height:100vh;
  background-color: rgba(156, 157, 158, 0.952);
    display: flex;
    flex-direction: column;
    padding: 20px;
    color:white;
 box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  position: fixed;
  top:0;
    left:0;
    z-index:1000;
  
    

}
.sidebar h2{
    padding-top: 10px;
     text-align:center;
    margin-bottom:30px;
    font-size: 30px;
}
.sidebar a{
     display:block;
    text-decoration:none;
    color:white;
    font-size:20px;
    font-weight:bold;
    padding:15px 0;
}
.sidebar button{
    margin-top:auto;
    border:none;
    padding: 10px;
    font-size: 15px;
     background-color: rgb(160, 48, 48);
    color:white;
   
    border-radius:7px;
    cursor:pointer;
}
.router-link-active{
    color:rgb(102,30,30);
}
.sidebar a:hover{
    text-decoration:underline;
    cursor:pointer;
}

</style>
