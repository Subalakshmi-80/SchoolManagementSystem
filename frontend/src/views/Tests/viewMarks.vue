<template>
<TeacherNavbar>

<div class="container d-flex flex-column justify-content-center align-items-center my-3">
<h1>View Marks</h1>
<h2 class="fs-2 text-success fw-bold my-2 text-uppercase" 
 v-if="tests && tests.class && tests.class.standard">{{ tests.name }} ({{ tests.class.standard.name }}-{{ tests.class.name }})</h2>
<button @click="router.push('/test/list')" class="btn btn-secondary fw-bold px-4 py-2">Back</button>


<p  class="text-danger p-4 fw-bold fs-4 " v-if="marks.length === 0">No Marks Found</p>
<div v-else class="mt-3 w-75">

<div class="d-flex justify-content-end align-items-center gap-3 mb-2">

<span class="badge text-bg-success rounded-pill px-3 py-2">P - Present</span>
<span class="badge text-bg-danger rounded-pill px-3 py-2 ">AB - Absent</span>
</div>
<form >

<table class="table table-bordered ">

<thead>
<tr class="text-center align-middle">
<th>S.No</th>
<th >Register No</th>
<th>First_Name</th>
<th>Last_Name</th>
<th>Class</th>
<th>Status</th>
<th>Marks</th>
<th>Result</th>

</tr></thead>

<tbody>
<tr v-for="(mark,index) in marks" :key="mark.id" class="text-center align-middle">

<td>{{ index+1 }}</td>
<td>{{ mark.student.regNo }}</td>
<td>{{ mark.student.firstName }}</td>
<td>{{ mark.student.lastName }}</td>
<td>{{ mark.test.class.standard.name }}-{{ mark.test.class.name }}</td>
<td>

      <div class="d-flex justify-content-center align-items-center gap-2">
        <span v-if="mark.status === 'Present'"
            class="badge text-bg-success rounded-pill  px-3 py-2 status-badge">P
        
        </span>

        <span v-else
            class="badge text-bg-danger rounded-pill  px-2 py-2 status-badge">AB
        
        </span>
    
    </div>
</td>
<td>{{ mark.StdMarks ?? '-'}}</td>

<td>
    <span v-if="mark.status === 'Absent'" class="badge text-bg-secondary px-3 py-2 result-badge">Absent</span>
    <span v-else-if="mark.StdMarks >= getPassMark()" class="badge text-bg-success px-3 py-2 result-badge">Pass</span>
    <span v-else class="badge text-bg-danger px-3 py-2 result-badge">Fail</span>
</td>
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
            console.log(err.response.data.error)
        }
    }
    onMounted(getMarks);


    const getPassMark = ()=>{
        return Math.ceil(tests.value.maxMarks * 35/100)
    }
    </script>

    <style scoped>
        .result-badge{
            width: 70px;
            display: inline-block;
            text-align: center;
        }

        .status-badge {
    width: 40px;
    display: inline-block;
    text-align: center;
}
    </style>