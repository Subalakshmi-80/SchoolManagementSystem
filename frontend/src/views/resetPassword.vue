


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
    <h2 class="fw-bold fs-4 mx-5  ">Reset Password</h2>
    <p class="mx-5">Enter your new password.</p>  

       <form @submit.prevent="resetPassword">
                    <div class="mb-3 mx-5 position-relative" >
                        <label class="fs-6 fw-bold">New password *</label>
                        <input v-model="data.password" required :type="showPassword ? 'text' : 'password'" placeholder="Enter Your New Password" class=" form-control rounded-4 p-3 mt-2 rounded"/>
                        
                        <i :class="showPassword? 'bi bi-eye-slash-fill':'bi bi-eye-fill'"
                        class="position-absolute top-50 end-0 pointer fs-5 me-3" @click="showPassword = !showPassword"></i>
                                           </div>

                    <div class="mb-3 mx-5 position-relative">
                        <label class="fs-6 fw-bold">Confirm new password *</label>
                        <input v-model="confirmPassword" required :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm Your New Password" class=" form-control rounded-4 p-3 mt-2 rounded"/>


                         <i :class="showConfirmPassword? 'bi bi-eye-slash-fill':'bi bi-eye-fill'"
                        class="position-absolute top-50 end-0 pointer fs-5 me-3"
                        @click="showConfirmPassword =!showConfirmPassword"></i>

                        <p class="text-danger fw-bold" v-if="data.password !=confirmPassword">Password Not Match</p>
                    </div>

                  
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
import {ref} from 'vue';
import axios from 'axios';


const router = useRouter();
const route = useRoute();

const email = route.query.email
const data = ref({
    password:""
})
const confirmPassword = ref("");
console.log(email)

const resetPassword = async() =>{
     if (data.value.password !== confirmPassword.value) {
        alert("Password Not Match")
        return;
    }
    try{
        const res= await axios.post("http://localhost:5000/api/reset-password",{
            email:email,
            password:data.value.password
        })
        alert(res.data);
        router.push("/")
    }catch(err){
        alert(err.response.data)
    }

}

const showPassword = ref(false);
const showConfirmPassword = ref(false);



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