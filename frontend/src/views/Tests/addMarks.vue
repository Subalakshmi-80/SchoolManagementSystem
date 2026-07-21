<template>
<TeacherNavbar>
<div class="container d-flex flex-column justify-content-center align-items-center my-3">
<h1>Add Marks</h1>
<h2 class="fs-2 text-success fw-bold my-2 text-uppercase">{{ tests.name }} ({{ tests.class_name }})</h2>


<p  class="text-danger p-4 fw-bold fs-4 " v-if="students.length === 0">No Students Found</p>
<div v-else class="mt-3 w-75">
<form @submit.prevent="saveMarks()">

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
<tr v-for="student in students" :key="student.id" class="text-center">
<td class="p-3">{{ student.regno }}</td>
<td class="p-3">{{ student.first_name }}</td>
<td class="p-3">{{ student.last_name }}</td>
<td class="p-3">{{ student.class_name }}</td>
<td class="p-3  d-flex justify-content-center align-items-center">
<input type="number" v-model="student.mark" required class="form-control w-50">
</td>

</tr>
</tbody>


</table>

<div class="d-flex justify-content-center align-items-center mt-5 gap-4">
<button type="submit" class="btn btn-success fw-bold px-4 py-2">Save Marks</button>
<button @click="router.push('/testlist')" class="btn btn-secondary fw-bold px-4 py-2">Cancel</button>

</div>

</form>


</div>

</div>

</TeacherNavbar>
    </template>



    <script setup>
    
    import TeacherNavbar from '../../components/TeacherNavbar.vue';
    import {onMounted, ref} from 'vue';
    import axios from 'axios';
    import {useRoute,useRouter} from 'vue-router';
    import API from "../../services/api.js"

    const route = useRoute();
    const router =useRouter();
    const testId   = route.params.id;

    const students=ref([])

    const getStudents = async() =>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get(`/api/tests/${testId}/students`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            students.value= res.data;
         
        }catch(err){
            console.log(err)
        }
    }

    onMounted(getStudents);


    const saveMarks = async() =>{
        try{
            const token = localStorage.getItem("token");

            const marks = students.value.map(student =>({
                student_id:student.id,
                mark:student.mark
        }))

        const res = await API.post(`/api/tests/${testId}/marks`,{marks},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data);
        router.push('/testlist')
        }catch(err){
          
            alert(err.response.data);
             router.push('/testlist')
           
        }
    }

    const tests = ref({})
    const getTest=async()=>{
        try{
            const token = localStorage.getItem("token");

            const res= await API.get(`/api/tests/${testId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            tests.value = res.data
        }catch(err){
            console.log(err)
        }
    }


    onMounted(getTest)
    </script>