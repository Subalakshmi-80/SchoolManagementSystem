<template>

    <AdminNavbar>

    <div class="container-fluid vh-100">

    <div class="d-flex justify-content-between m-5">
    <h1 class="fs-2 " style=" color:rgb(97,32,19);">Subject List</h1>
    <button class="btn btn-success fw-bold" @click="router.push('/subject/create')">Add Subject</button>
    
    </div>

    <p class="text-start m-5 fs-5 text-danger fw-bold"v-if="subjects.length === 0">Subject not found.</p>
    <div v-else  class="d-flex justify-content-center ">
      <table class="table table-bordered m-5 w-75 shadow">
    <thead >
    <tr class="text-center fs-5">
    <th class="p-3">Subject Name</th>
    <th class="p-3">Actions</th>
    
    
    </tr>
    </thead>
    <tbody>
    <tr v-for="subject in subjects" :key="subject.id" class="text-center  fs-5">
    <td class="p-3 text-dark">{{ subject.subject_name }}</td>
    <td class="p-3">
    <div class="d-flex justify-content-center align-items-center gap-2">
    <button class="btn btn-secondary px-4  py-2 fw-bold" @click="router.push(`/subject/edit/${subject.id}`)">Edit</button>
    <button class="btn btn-danger px-4 py-2 fw-bold" @click="deleteSubject(subject.id)">Delete</button>
    </div>
    </td>
    
    </tr>
    </tbody>
    
    </table>
    </div>
  
    </div>
    </AdminNavbar>
    </template>


    <script setup>

    import AdminNavbar from '../../components/AdminNavbar.vue';
    import {ref,onMounted} from 'vue';
    import axios from "axios";
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const subjects = ref([])

    const getSubjects = async() =>{
    try{
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/subjects",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        subjects.value = res.data;
       
    }catch(err){
        console.log(err.response.data)
    }
    }

    onMounted(getSubjects);


    const deleteSubject = async(id) =>{
        const confirmDelete = confirm("Are You sure you want to delete this subject?");

        if(!confirmDelete)  return;
        try{
            const token = localStorage.getItem("token");
           const res= await axios.delete(`http://localhost:5000/api/subjects/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            alert(`${res.data.subject.subject_name} ${res.data.msg}`);
            
            await getSubjects()

        }catch(err){
            alert(err.response.data)
        }
    }
    </script>