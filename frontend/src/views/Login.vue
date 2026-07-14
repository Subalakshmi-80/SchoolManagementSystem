


<template>
    <div class="container-fluid vh-100  ">

        <div class="row h-100 ">
            <div class="h-100 d-none d-md-flex col-md-6 col-lg-7  justify-content-center align-items-center">
                <img src="../assets/illustration.jpg" class="img-fluid h-75 " alt="Illustration">
            </div>

            <div class="shadow col-12 col-md-6 col-lg-5 d-flex align-items-center">
               <div  class="w-100">
              <div class="d-flex align-items-center mb-5 mx-5">
    <i class="bi bi-mortarboard-fill fs-1 text-success me-3"></i>
    <h1 class="fw-bold text-success m-0">SCHOOL MS</h1>
</div>

                <form @submit.prevent="checkLogin">
                    <div class="mb-3 mx-5">
                        <label class="fs-6 fw-bold">Email *</label>
                        <input v-model="email" required type="email" placeholder="Enter Your Email" class=" form-control rounded-4 p-3 mt-2 rounded"/>
                    </div>

                     <div class="mb-3 mx-5 ">
                        <label class="fs-6 fw-bold">Password *</label>

                        <div class="position-relative">
                             <input v-model="password" required
                        :type="showPassword?'text':'password'" 
                        placeholder="Enter Your Password" 
                        class="rounded-4  form-control p-3 mt-2 rounded"/>
                       

                        <i :class="showPassword? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'" 
                        class="pointer fs-5 position-absolute top-50 end-0 me-3 translate-middle-y "@click="showPassword = !showPassword"></i>
                    </div>
                     </div>
                       

                    <button class="btn btn-success px-5 py-2 mt-3 mx-5 my-2 fs-5 mb-4  rounded-5 pointer">Login</button>

                      <router-link to="/forgot-password"class="text-decoration-underline d-block text-success fs-6 fw-bold mx-5  ">Forgot password?</router-link>

                </form>

                
               </div>

             
            </div>
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
    const showPassword = ref(false)
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


input:focus{
    outline:none;
    box-shadow: none;
    border-color: rgb(43, 42, 42);
}
.pointer{
    cursor: pointer;
}
</style>