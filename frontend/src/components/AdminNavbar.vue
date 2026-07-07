<template>
<div class="container">
    <div class="header">

     <h1>School Management System</h1>
     <p>{{role}}</p>
 </div>
     <nav class="nav-links">

        <ul>
            <li><router-link to="/admin">Dashboard</router-link></li>
            <li><router-link to="/studentlist">Students</router-link></li>
            <li @click.prevent="logout">Logout</li>
        </ul>

     </nav>
   

</div>
</template>


<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const getrole = localStorage.getItem("role");
const role = ref(getrole);

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/")
}
</script>


<style scoped>

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin:30px;
}
.header h1{
     font-size:40px;
      color:rgb(97, 32, 19);
    
}
.header p{
    color:rgb(97, 32, 19);
    font-size:20px;
      text-transform:capitalize;
}
.nav-links {
    background-color:rgb(151, 142, 140);
    padding:20px;
    color:white;
    font-size:20px;
}
.nav-links ul{
    display:flex;
    justify-content:space-between;
    align-items:center;
    list-style-type:none;

}
.nav-links ul li a{
    text-decoration:none;
    color:white;
}

.nav-links ul li:hover{
    text-decoration:underline;
    cursor:pointer;
}

</style>
