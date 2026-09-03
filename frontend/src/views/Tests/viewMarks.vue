<template>
<TeacherNavbar>

<div class="container d-flex flex-column justify-content-center align-items-center ">
<h1 class="fs-4">View Marks</h1>
<h2 class="fs-5 text-success fw-bold  text-uppercase" 
 v-if="tests && tests.class && tests.class.standard">{{ tests.name }} ({{ tests.class.standard.name }}-{{ tests.class.name }})</h2>
<button @click="router.push('/test/list')" class="btn btn-secondary fw-bold px-4 py-2">Back</button>


<p  class="text-danger p-4 fw-bold fs-4 " v-if="marks.length === 0">No Marks Found</p>
<div v-else class="mt-3 w-75">

<div class="d-flex justify-content-between align-items-center mb-3  ">

<div>
    <select v-model="selectedFilter" class="form-select w-auto">
        <option value="">All students</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
        <option value="Top3">Top 3</option>
        <option value="Top5">Top 5</option>

    </select>
</div>
<div class="d-flex  gap-3 ">

<span class="badge text-bg-success rounded-pill px-3 py-2">P - Present</span>
<span class="badge text-bg-danger rounded-pill px-3 py-2 ">AB - Absent</span>
</div>



</div>

<form >

<div class="d-flex justify-content-center  align-items-center gap-3 mb-3">

    <div class="stats-box text-center">
        <small>Total Students</small>
        <h4>{{ summary.total}}</h4>
    </div>

     
    <div class="stats-box text-center">
        <small>Present</small>
        <h4>{{ summary.present }}</h4>
    </div>

    <div class="stats-box text-center">
        <small>Absent</small>
        <h4>{{ summary.absent }}</h4>
    </div>

    <div class="stats-box text-center">
        <small>Pass</small>
        <h4>{{ summary.pass }}</h4>
    </div>

    <div class="stats-box text-center">
        <small>Fail</small>
        <h4>{{ summary.fail }}</h4>
    </div>


</div>
<p v-if="filteredMarks.length === 0" class="text-danger fw-bold text-center">
    No students found for selected filter.
</p>

<table v-else class="table table-bordered ">

<thead>
<tr class="text-center align-middle">
<th>S.No</th>
<th >Register No</th>
<th>FirstName</th>
<th>LastName</th>
<th>Class</th>
<th>Status</th>
<th>Marks</th>
<th>Result</th>

</tr></thead>

<tbody>
<tr v-for="(mark,index) in filteredMarks" :key="mark.id" class="text-center align-middle">

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
    import {ref,onMounted, computed} from 'vue';
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



    const selectedFilter = ref('');

    const filteredMarks = computed(()=>{
        if(!selectedFilter.value){
            return marks.value
        }

        if(selectedFilter.value === "Present"){
            return marks.value.filter(mark => mark.status === "Present")
        }

        if(selectedFilter.value === "Absent"){
            return marks.value.filter(mark=>mark.status==="Absent");
        }

        if(selectedFilter.value === "Pass"){
            return marks.value.filter(mark=> mark.status === "Present" && mark.StdMarks >= getPassMark())
        }

        if(selectedFilter.value === "Fail"){
            return marks.value.filter(mark => mark.status === "Present" && mark.StdMarks <getPassMark())
        }
        
        if(selectedFilter.value === "Top3"){
            return marks.value.
                filter(mark=> mark.status === "Present" && mark.StdMarks >= getPassMark())
                .sort((a,b)=>b.StdMarks - a.StdMarks)
                .slice(0,3)
        }

        if(selectedFilter.value === "Top5"){
            return marks.value
                .filter(mark => mark.status === "Present" && mark.StdMarks >= getPassMark())
                .sort((a,b)=>b.StdMarks - a.StdMarks)
                .slice(0,5)
        }
    })
    
        const summary = computed(()=>{
        return {
            total:marks.value.length,
            present:marks.value.filter(mark =>
            mark.status==="Present").length,

            absent:marks.value.filter(mark=>
                mark.status === "Absent").length,

            pass:marks.value.filter(mark=>
                mark.status === "Present" && mark.StdMarks >= getPassMark()).length,

            fail:marks.value.filter(mark=>
                mark.status === "Present" && mark.StdMarks < getPassMark()).length
        }
        })
    </script>

    <style >
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

.stats-box {
    width: 140px;
    padding: 5px;
    border: 1px solid #dee2e6;
    background: #fff;
}

.stats-box + .stats-box {
    border-left: none;
}

.stats-box small {
    font-weight: 600;
    color: #6c757d;
}

.stats-box h4 {
    margin: 5px 0 0;
    font-weight: bold;
}
    </style>