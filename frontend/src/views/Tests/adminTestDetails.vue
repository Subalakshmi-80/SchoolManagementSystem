<template>

    <AdminNavbar>
        <div>
            <div class=" mx-5" v-if="tests && tests.class && tests.subject">
                <h1 class="fs-4 text-success fw-bold text-capitalize text-center">{{ tests.name }}</h1>

                <div class="d-flex justify-content-center align-items-center">
                 <button class="btn btn-outline-secondary " @click="router.push('/admin/testlist')">Back</button>   
                </div>
               
                <hr>
            <div class="d-flex">
                <div class="card shadow-sm p-4 test-info-card align-middle ">
                <p class="mb-2 mt-3">
    <strong>Class:</strong> {{ tests.class.standard.name }}-{{ tests.class.name }}
</p>

<p class="mb-2">
    <strong>Subject:</strong> {{ tests.subject.subjectName }}
</p>

<p class="mb-2">
    <strong>Test Date:</strong> {{ formatDate(tests.testDate) }}
</p>

<p class="mb-0">
    <strong>Max Marks:</strong> {{ tests.maxMarks }}
</p>
                </div>
           

            
            <div class="d-flex flex-wrap gap-3 mb-3 ms-5 mt-3">

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

    <div class="stats-box text-center">
        <small>Pass %</small>
        <h4>{{ getPassPercentage}}</h4>
    </div>


</div>
            
            </div>

            </div>
            

            <div class="ms-5 mt-3 me-3 d-flex justify-content-between align-middle-center">
                <div class="dropdown">
                    <button class="btn btn-light border dropdown-toggle" 
                    type="button"  
                    data-bs-toggle="dropdown">All Students</button>

                    <ul class="dropdown-menu class-dropdown">
                        <li>
                            <button class="dropdown-item">All Students</button>
                        </li>

                        <li>
                            <button class="dropdown-item">Present</button>
                        </li>

                        <li>
                            <button class="dropdown-item">Absent</button>
                        </li>

                         <li>
                            <button class="dropdown-item">Pass</button>
                        </li>

                         <li>
                            <button class="dropdown-item">Fail</button>
                        </li>

                         <li>
                            <button class="dropdown-item">Top 3</button>
                        </li>

                         <li>
                            <button class="dropdown-item">Top 5</button>
                        </li>
                    </ul>
                </div>
            
                <div class="d-flex justify-content-center align-items-center gap-3 ">

<span class="badge text-bg-success rounded-pill px-3 py-2">P - Present</span>
<span class="badge text-bg-danger rounded-pill px-3 py-2">AB - Absent</span>
</div>
            </div>

            <div>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center middle-center">
                            <th>S.No</th>
                            <th>Register No</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Class</th>
                            <th>Status</th>
                            <th>Marks</th>
                            <th>Result</th>
                        </tr>
                    </thead>

                    <tbody>
                    
                        <tr v-for="(mark,index) in marks" :key="mark.id" class="text-center align-middle">
                            <td>{{ index+1 }}</td>
                            <td>{{ mark.student.regNo }}</td>
                            <td>{{ mark.student.firstName }}</td>
                            <td>{{ mark.student.lastName }}</td>
                            <td>{{ mark.class.standard.name }}-{{ mark.class.name }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        
        </div>
    
    </AdminNavbar>

</template>


<script setup>

import AdminNavbar from '../../components/AdminNavbar.vue';
import { useRoute,useRouter } from 'vue-router';
import  {ref,onMounted,computed} from 'vue';
import API from '../../services/api.js';
import router from '../../router/index.js';

const route = useRoute();

const testId = route.params.id;

const tests = ref({})
const getTest = async()=>{
    try{
        const token = localStorage.getItem('token');

        const res  = await API.get(`/api/tests/${testId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        tests.value = res.data;
        

    }catch(error){
        console.log(error);
    }
}

onMounted(getTest);

const formatDate = (date)=>{
    if(!date) return "";

    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-GB')
}
const marks = ref([])
const getMarks = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get(`/api/tests/${testId}/marks`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        marks.value = res.data  

    }catch(error){
        console.log(error)
    }
}

onMounted(getMarks)
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

        const getPassPercentage = computed(()=>{
            if(summary.value.present === 0){
                return "-";
            }

            return ((summary.value.pass/summary.value.present)*100).toFixed(1)+"%"
        })

        const getPassMark = ()=>{
        if (!tests.value.maxMarks) {
        return 0
    }

    return Math.ceil(tests.value.maxMarks * 35 / 100)
    }
</script>



<style scoped>
.test-info-card {
    width: 320px;
}

.stats-box{
    width:200px;
    min-height: 90px;
    padding: 12px;
    border:1px solid rgb(222, 226, 230);
    background: rgb(255, 255, 255);
}


.class-dropdown{
    max-height: 150px;
    overflow-y: auto;
}

</style>