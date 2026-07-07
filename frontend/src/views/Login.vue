


<template>
   <div class="login-page">
    <h1>School Management System</h1>
<div class="login">
 <h2>Login</h2>

    <form @submit.prevent="checkLogin" class="form">
        <input v-model="email" placeholder="Enter Email Address" type="email" required/><br/>
        <input v-model="password" placeholder ="Enter Password" type="password" required/><br/>
<button>Login</button>
        

    </form>

</div>
</div>
</template>

<script setup>
import {useRouter}  from 'vue-router';
import {ref} from 'vue';
import axios from 'axios';

const router = useRouter();
  const email = ref("");
    const password = ref("");
const checkLogin = () => {

    axios.post("http://localhost:5000/api/login",{
        email:email.value,
        password:password.value
    }).then(res =>{
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("role", res.data.role)
       
        if(res.data.role === "admin"){
            router.push("/admin")
        }
        else if(res.data.role === "student"){
            router.push("/student")
        }
    }).catch(err =>{
        alert("Invalid credentials");
    })

}
</script>


<style scoped>


.login-page {
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
margin-top:100px;
  
}
.login-page h1{
      font-size:45px;
      color:rgb(97, 32, 19);
}
.login{
    background-color:white;
    margin-top:40px;
    padding:30px 60px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    border-radius:20px;
    width:350px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.login h2{
    text-align:center;
    margin:10px 0;
    font-size:30px;
    color:rgb(87, 27, 27)
}
.login input{
    margin:10px 5px;
    padding:15px;
    border:none;
    border-bottom:1px solid rgb(102, 30, 30);
}
.login input:focus{
    outline:none;
}
.login button{
    margin:10px 60px;
    padding:10px 35px; 
    background-color: rgb(102, 30, 30);
    color:white;
    border:none;
    border-radius:7px;
    cursor:pointer;
    font-size:15px;
}
.login button:hover{
    background-color: rgb(177, 81, 81);
}
</style>