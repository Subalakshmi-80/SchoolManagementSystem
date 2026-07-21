<template>
<TeacherNavbar>

<div class="container d-flex flex-column justify-content-center align-items-center my-3">
<h1>View Marks</h1>
<h2 class="fs-2 text-success fw-bold my-2 text-uppercase">{{ tests.name }} ({{ tests.class_name }})</h2>
<button @click="router.push('/testlist')" class="btn btn-secondary fw-bold px-4 py-2">Cancel</button>


<p  class="text-danger p-4 fw-bold fs-4 " v-if="marks.length === 0">No Marks Found</p>
<div v-else class="mt-3 w-75">
<form >

<table class="table table-bordered ">

<thead>
<tr class="text-center">
<th class="p-3">Register No</th>
<th class="p-3">First_Name</th>
<th class="p-3">Last_Name</th>
<th class="p-3">Class</th>
<th class="p-3">Marks</th>

</tr></thead>

<tbody>
<tr v-for="mark in marks" :key="mark.id" class="text-center">
<td class="p-3">{{ mark.regno }}</td>
<td class="p-3">{{ mark.first_name }}</td>
<td class="p-3">{{ mark.last_name }}</td>
<td class="p-3">{{ mark.class_name }}</td>
<td class="p-3" >{{ mark. std_marks}}</td>

</tr>
</tbody>

</table>

</form>
</div>

</div>
</TeacherNavbar>
    </template>


    <script setup>
    import TeacherNavbar from '../../components/TeacherNavbar.vue';
    import axios from 'axios';
    import {ref,onMounted} from 'vue';
    import { useRouter,useRoute } from 'vue-router';
import API from "../../services/api.js"
    const router = useRouter();
    const route = useRoute();

    const testId = route.params.id

    const tests = ref({})
    const getTest = async() =>{
        try{
            const token = localStorage.getItem("token");
            const res=await API.get(`/api/tests/${testId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            tests.value = res.data;
        }catch(err){
            console.log(err)
        }
    }

    onMounted(getTest);

    const marks = ref([])

    const getMarks = async() =>{
        try{
            const token = localStorage.getItem("token");
            const res= await API.get(`/api/tests/${testId}/marks`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            marks.value = res.data
            
        }catch(err){
            console.log(err.response.data)
        }
    }
    onMounted(getMarks)
    </script>