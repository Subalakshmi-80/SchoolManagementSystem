<template>

    <AdminNavbar>
    <div class="container d-flex flex-column justify-content-center align-items-center my-5">
<h2 class="fs-2 text-danger fw-bold my-5">Edit Subject</h2>
<form @submit.prevent="updateSubject()" class=" w-50">
<div class="d-grid">
<label class="fs-4 text-black fw-bold">Subject Name</label>
<input type="text" v-model="subjects.subject_name" class="form-control p-3 my-3"required>
</div>

 <div class="d-flex gap-4 mt-3 justify-content-center align-items-center">
    <button class="btn btn-success px-4  py-2 fw-bold" >Update Subject</button>
    <button class="btn btn-secondary px-4 py-2 fw-bold" @click="router.push('/subjectlist')">Cancel</button>
    </div>

</form>


</div>

    
    </AdminNavbar>

    </template>



    <script setup>
import AdminNavbar from '../../components/AdminNavbar.vue';
import {ref,onMounted} from 'vue';
import axios from 'axios';
import { useRoute,useRouter } from 'vue-router';


const router = useRouter();
const route = useRoute();


const subjects = ref({
    subject_name:""
})

const id = route.params.id;
const getSubject = async() => {
    
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/subjects/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        subjects.value = res.data
    }catch(err){
        alert(err.response.data)
    }
}


 onMounted(getSubject);


 const updateSubject = async() =>{
    try{
        const token = localStorage.getItem("token");

        const res = await axios.put(`http://localhost:5000/api/subjects/${id}`,subjects.value,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data);

        router.push('/subjectlist')

    }catch(err){
        alert(err.response.data)
    }
 }
    </script>
