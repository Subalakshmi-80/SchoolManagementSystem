

<template>
<TeacherNavbar>
<div class="container d-flex flex-column justify-content-center align-items-center my-5">
<h2 class="fs-2 text-danger fw-bold my-3">Add Test</h2>

<form  class="w-50" @submit.prevent="saveTest()">

<div class="m-3">
<label class="fs-5 mb-2 fw-bold">Test Name</label>
<input type="text" class="form-control" v-model="test.name">
</div>

<div class="m-3">
<label class="fs-5 mb-2 fw-bold">Class</label>
<select class="form-select" v-model="test.class_id">
<option disabled value="">Select class</option>
<option v-for="cls in classes" :key="cls.id" :value="cls.id">{{cls.standard_name}} - {{ cls.class_name }}</option>
</select>
</div>

<div class="m-3">
<label class="fs-5 mb-2 fw-bold">Subject</label>
<select  class="form-select" v-model="test.subject_id">
 <option disabled value="">Select Subject</option>
<option  v-for="subject in subjects" :key="subject.id" :value="subject.id" >{{ subject.subject_name }}</option>
</select>
</div>

<div class="m-3">
<label class="fs-5 mb-2 fw-bold">Date</label>
<input class="form-control" type="date" v-model="test.test_date" >
</div>

<div class="d-flex justify-content-center align-items-center gap-3 mt-4">
<button class="btn btn-success px-4 py-2  fw-bold">Save Test</button>
<button class="btn btn-secondary  px-4 py-2 fw-bold">Cancel</button>
</div>
</form>

</div>

</TeacherNavbar>
    </template>


    <script setup >
import TeacherNavbar from '../../components/TeacherNavbar.vue';
import axios from 'axios';
import {ref,onMounted} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const subjects = ref([])

const test = ref({
    name:"",
    class_id:"",
    subject_id:"",
    test_date:""
})

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
        console.log(err)
    }
}
onMounted(getSubjects);

const classes = ref([])
const getClass=async() =>{
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/classes",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value= res.data;
    }catch(err){
        console.log(err)
    }
}

onMounted(getClass);

const saveTest = async() =>{
    try{
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:5000/api/tests",test.value,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data);
        router.push("/testlist")
    }catch(err){
        alert(err.response.data)
    }
}
</script>

<style scoped>
input:focus,select:focus{
    outline:none;
    box-shadow: none;
    border-color: rgb(43, 42, 42);
}
</style>