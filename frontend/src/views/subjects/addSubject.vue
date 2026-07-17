<template>
<AdminNavbar>

<div class="container d-flex flex-column justify-content-center align-items-center my-5">
<h2 class="fs-2 text-danger fw-bold my-5">Add Subject</h2>
<form @submit.prevent="saveSubject()" class=" w-50">
<div class="d-grid">
<label class="fs-4 text-black fw-bold">Subject Name</label>
<input type="text" v-model="subjects.subject_name"  class="form-control p-3 my-3"required>
</div>

 <div class="d-flex gap-4 mt-3 justify-content-center align-items-center">
    <button class="btn btn-success px-4  py-2 fw-bold">Save Subject</button>
    <button class="btn btn-secondary px-4 py-2 fw-bold" @click="router.push('/subjectlist')">Cancel</button>
    </div>

</form>


</div>

</AdminNavbar>

    </template>


    <script setup>
    import AdminNavbar from '../../components/AdminNavbar.vue';
    import {ref} from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const router = useRouter()

    const subjects = ref({
        subject_name:""
    })
    
    const saveSubject = async() =>{
        try{
            const token = localStorage.getItem("token");
            const res= await axios.post("http://localhost:5000/api/subjects",subjects.value,{
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

    <style scoped>
    input:focus{
    outline:none;
    box-shadow: none;
    border-color: rgb(43, 42, 42);
}
    </style>