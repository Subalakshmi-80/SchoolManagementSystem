<template>
<TeacherNavbar>

<div class="container d-flex flex-column justify-content-center align-items-center my-3">
<h1>Edit Marks</h1>
<h2 class="fs-2 text-success fw-bold my-2 text-uppercase">{{ tests.name }} ({{ tests.class_name }})</h2>



<p  class="text-danger p-4 fw-bold fs-4 " v-if="marks.length === 0">No Marks Found</p>
<div v-else class="mt-3 w-75">
<form @submit.prevent="updateMarks()">

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
<td class="p-3" >
<input type="number" class="form-control" v-model="mark.std_marks"/> 
</td>

</tr>
</tbody>


</table>

<div class="d-flex justify-content-center align-items-center gap-3 mt-5">
<button type="submit" class="btn btn-success fw-bold px-4 py-2">Update Marks</button>
<button @click="router.push('/testlist')" class="btn btn-secondary fw-bold px-4 py-2">Cancel</button>

</div>

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

    const router = useRouter();
    const route = useRoute();

    const testId = route.params.id

    const tests = ref({})
    const getTest = async() =>{
        try{
            const token = localStorage.getItem("token");
            const res=await axios.get(`http://localhost:5000/api/tests/${testId}`,{
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

            const res= await axios.get(`http://localhost:5000/api/tests/${testId}/marks`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            marks.value = res.data
           
        }catch(err){
            console.log(err.response.data)
        }
    }
    onMounted(getMarks);
   const updateMarks = async()=>{
    try{
        const token = localStorage.getItem("token");
        
            const updateMark = marks.value.map(mark=>({
                student_id:mark.student_id,
                std_marks:mark.std_marks
            }))
        const res = await axios.put(`http://localhost:5000/api/tests/${testId}/marks`,{updateMark},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data);
        router.push(`/test/viewMarks/${testId}`)
    }catch(err){
        console.log(err)
    }
   }
    </script>