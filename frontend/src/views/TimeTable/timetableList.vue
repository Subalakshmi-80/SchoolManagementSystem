<template>
<AdminNavbar>

<div class="container">
<div class="d-flex my-5 justify-content-around align-items-center">
<h1 class="fw-bold text-danger">Timetable</h1>
<button class="btn btn-success px-4 py-2 fw-bold " @click="router.push('/timetable/create')">ADD </button>
</div>

  <div class="d-flex  justify-content-center align-items-center gap-4 mt-5 ">
    <select v-model="getTimetableByClass.class_id" class="form-select w-25 ">
        <option value="" disabled>Select Class</option>
        <option  v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.standard_name }} - {{ cls.class_name }}</option>
        </select>

        <select class="form-select w-25 " v-model="getTimetableByClass.day">
        <option value="" disabled>Select Day</option>
        <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>

      
<button class="btn  btn-outline-primary px-4 fw-bold " @click="getTimetable()">view</button>
<button class="btn btn-outline-secondary px-4 fw-bold" @click="editTimetable()">Edit</button>
    </div>
<div v-if="searched && timetable.length ===0" class="text-center py-5 text-danger fs-2 fw-bold">  No timetable found</div>

<div v-else-if="timetable.length > 0" class="w-100 d-flex justify-content-center align-items-center my-5" >

  <table class="table table-bordered w-75 table-hover ">
        <thead class="table-light">
        <tr>
        <th>period</th>
        <th>Subject</th>
        <th>Time</th>
        </tr>
        
        </thead>

        <tbody>
            
            <tr v-for="tt in timetable" :key="tt.id">
            <td>{{ tt.period_no }}</td>
            <td>{{ tt.subject_name }}</td>
             <td>{{ tt.start_time.slice(0,5) }}-{{ tt.end_time.slice(0,5) }}</td>
            </tr>
        </tbody>
        </table>
</div>

</div>

</AdminNavbar>
    </template>


    <script setup>
    
    import AdminNavbar from '../../components/AdminNavbar.vue';
    import {useRouter} from 'vue-router';
    import {ref,onMounted} from 'vue';
    import API from '../../services/api.js';
import EditTimetable from './editTimetable.vue';

    const router = useRouter();

    const classes = ref([]);
    const searched = ref(false)
    const getClass = async() =>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get("/api/classes",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            classes.value = res.data
        }catch(err){
            console.log(err)
        }
    }

    onMounted(getClass);

    const days = ref(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]);

    const getTimetableByClass= ref({
        class_id:"",
        day:""
    })
    const timetable = ref([]);

    const getTimetable = async() =>{

        if(!getTimetableByClass.value.class_id || !getTimetableByClass.value.day){
            alert("Please Select Class and Day");
            return;
        }
        try{
            const token = localStorage.getItem("token");

            const res = await API.get(`/api/timetable/class/${getTimetableByClass.value.class_id}?day=${getTimetableByClass.value.day}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            timetable.value=res.data;
            searched.value=true
     
        }catch(err){
            alert(err.response.data)
        }
    }

const editTimetable = () =>{
     if(!getTimetableByClass.value.class_id || !getTimetableByClass.value.day){
            alert("Please Select Class and Day");
            return;
        }
        router.push(`/timetable/edit/${getTimetableByClass.value.class_id}?day=${getTimetableByClass.value.day}`)
}
  
    </script>