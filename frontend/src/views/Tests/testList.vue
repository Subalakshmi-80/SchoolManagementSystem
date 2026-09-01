<template>

    <TeacherNavbar>
    <div class="px-3">

    <div class="d-flex justify-content-between  align-items-center mx-5 my-3">
    <h1 class="fs-2"  style=" color:rgb(97,32,19);">Test Lists</h1>
    <button class="btn btn-success fw-bold px-3 py-2" @click="router.push('/test/create')">Add Test</button>
    </div>
    

    <p v-if="tests.length ===0" class="m-5 text-danger fw-bold fs-5">No Test Record</p>

    <div v-else >
    <table class="table table-bordered mt-5 w-100 shadow">
    
    <thead>
    <tr class="text-center">
    <th class="p-3">S.No</th>
    <th class="p-3">Test Name</th>
    <th class="p-3">Class</th>
    <th class="p-3">Subject</th>
    <th class="p-3">Max Marks</th>
    <th class="p-3">Date</th>
    <th class="p-3">Marks</th>
    <th class="p-3">Actions</th>
    </tr>
    
    </thead>

    <tbody>
<tr v-for="(test,index) in tests" :key="test.id"  class="text-center align-middle">
<td>{{ index+1 }}</td>
<td>{{ test.name }}</td>
<td>{{ test.class.standard.name }}-{{ test.class.name }}</td>
<td>{{ test.subject.subjectName}}</td>
<td>{{ test.maxMarks }}</td>
<td>{{ formatDate(test.testDate) }}</td>

<td>

<div class="d-flex  align-items-center justify-content-center gap-2">


<button v-if="test.marksEntered" class="btn btn-outline-warning" @click="router.push(`/test/editMarks/${test.id}`)">Edit Marks</button>
<button  v-else class="btn btn-outline-primary" @click="router.push(`/test/enterMarks/${test.id}`)">Enter Marks</button>

<button class="btn btn-outline-success" @click="router.push(`/test/viewMarks/${test.id}`)">view Marks</button>

</div>
</td>
<td>
<div class="d-flex  align-items-center justify-content-center gap-2">

<button class="btn btn-outline-secondary" @click="router.push(`/test/edit/${test.id}`)">Edit</button>
<button class="btn btn-outline-danger" @click="deleteTest(test.id)">Delete</button>
</div>
</td>

</tr>
    </tbody>
    </table>
    </div>
    </div>
    </TeacherNavbar>
    </template>


    <script setup>
    import TeacherNavbar from '../../components/TeacherNavbar.vue';
    import {ref,onMounted} from 'vue';
    import axios from 'axios';
    import {useRouter} from 'vue-router'
import API from "../../services/api.js"

const router = useRouter()
   const tests = ref([])
    const getTests = async() =>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get("/api/tests",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
           
            tests.value = res.data
            
        }catch(err){
            alert(err.response.data.error)
        }
    }

    const formatDate = (date) =>{
    if(!date) return "";
    const newdate = new Date(date);
    return newdate.toLocaleDateString('en-GB')  //format date
}

    
    onMounted(getTests);

    const deleteTest = async(id) =>{
        const confirmDelete = confirm("Are you sure you want to delete this test?")
        if(!confirmDelete) return;
        try{
            const token = localStorage.getItem("token");
            const res = await API.delete(`/api/tests/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            alert(res.data.message);
            await getTests();
        }catch(err){
            console.log(err);
            alert(err.response.data.error)
        }
    }
    </script>