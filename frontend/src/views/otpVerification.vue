


<template>
    <div class="container-fluid vh-100  ">

        <div class="row h-100 ">
            <div class="h-100 d-none d-md-flex col-md-6 col-lg-7  justify-content-center align-items-center">
                <img src="../assets/illustration.jpg" class="img-fluid h-75 " alt="Illustration">
            </div>

            <div class="shadow col-12 col-md-6 col-lg-5 d-flex align-items-center">
               <div  class="w-100">
              <div class="d-flex align-items-center mb-3 mx-5">
    <i class="bi bi-mortarboard-fill fs-1 text-success me-3"></i>
    <h1 class="fw-bold text-success m-0">SCHOOL MS</h1>
</div>
    

<div>
    <h2 class="fw-bold fs-4 mx-5  ">Verify OTP</h2>
    <p class="mx-5">Enter the OTP sent to your email.</p>  

       <form @submit.prevent="verifyOTP">
                    <div class="mb-3 mx-5">
                        <label class="fs-6 fw-bold">OTP *</label>
                        <input v-model="data.otp" required type="text" placeholder="Enter Your OTP" class=" form-control rounded-4 p-3 mt-2 rounded"/>
                    </div>

                    <p class=mx-5>Didn't receive the OTP?
                    <a href="#" @click.prevent="resendOTP()" class="text-success text-decoration-underline fw-bold">Resend OTP </a></p>
                      <button class="btn btn-success px-5 py-2 mt-3 mx-5 my-2 fs-5 mb-4  rounded-5 pointer">Submit</button>

                      <router-link to="/" class="text-decoration-underline  text-success fs-6 fw-bold mx-5  ">Login with Password</router-link>

                </form>


                   
</div>

           

                   
                       

  </div>
                              
      </div>          
            
    </div></div>
 
</template>

<script setup>
import {useRouter,useRoute}  from 'vue-router';
import axios from 'axios';
import {ref} from 'vue';
import API from "../services/api.js"

const router = useRouter();
const route = useRoute();
const data =ref({
    otp:""
})

const email = route.query.email;

const verifyOTP = async() =>{

    try{
           const res = await API.post("/api/verify-otp",{
            email:email,
            otp:data.value.otp
           })
    alert(res.data);
    router.push({
        path:'/reset-password',
        query:{
            email:email
        }
    })
    }
    catch(err){
       alert(err.response.data)
        console.log(err)
    }
 
}


const resendOTP = async() =>{
    try{
       const res= await API.post("/api/resendOTP",{
            email:email
        })
          alert(res.data);
    }
    catch(err){
        alert(err.response.data)
    }
}
</script>


<style scoped>


input:focus{
    outline:none;
    box-shadow: none;
    border-color: rgb(43, 42, 42);
}
.pointer{
    cursor: pointer;
}
</style>