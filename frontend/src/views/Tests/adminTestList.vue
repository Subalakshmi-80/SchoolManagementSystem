<template>

<AdminNavbar>

<div >
<h1 class="fs-4 text-center text-success fw-bold ">Test List</h1>
<div class="d-flex justify-content-between me-5 mt-4">
<div class="dropdown ms-5">
    <button class="btn btn-light border dropdown-toggle" type="button" data-bs-toggle="dropdown">{{ selectedClassName }}</button>

    <ul class="dropdown-menu class-dropdown">

        <li>
            <button class="dropdown-item" @click="selectClass('','All classes')">
                All Classes
            </button>
        </li>

        <li v-for="cls in classes" :key="cls.id">

            <button class="dropdown-item" @click="selectClass(cls.id,`${cls.standard.name}-${cls.name}`)">{{ cls.standard.name }}-{{ cls.name }}</button>
        </li>
    </ul>
</div>

<div>
<input type="search" class="form-control " placeholder="Search test name..." v-model="searchValue">
</div>
</div>

<div class="mx-5">

<div v-if="filteredTests.length === 0" class="mt-3 text-danger fw-bold">No Test found for selected class</div>
<table v-else class="table table-bordered mt-3 w-100 shadow table-hover">
    <thead>
        <tr class="text-center align-middle">
            <th>S.No</th>
            <th>Test Name</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Students</th>
            <th>Pass %</th>
            <th>Actions</th>
        </tr>
    </thead>


    <tbody>
        <tr v-for="(test,index) in filteredTests" :key="test.id" class="text-center align-middle">
            <td>{{ index+1 }}</td>
            <td>{{ test.name }}</td>
            <td>{{ test.class.standard.name }}-{{ test.class.name }}</td>
            <td>{{ test.subject.subjectName }}</td>
            <td>{{ formatDate(test.testDate) }}</td>
            <td>{{ test.marks.length }}</td>
            <td>{{ getPassPercentage(test)}}</td>
            <td>
                <button class="btn btn-outline-success" @click="router.push(`/admin/testDetails/${test.id}`)">view Marks</button>
     
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
import {ref,onMounted, computed} from 'vue';
import API from '../../services/api.js';
import {useRouter} from 'vue-router';

const router = useRouter();

const tests = ref([]);

const getTests = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/tests",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        tests.value = res.data;
      
    }catch(error){
        console.log(error);
    }
}



onMounted(getTests);


const classes = ref([]);

const getClass = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/classes",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        classes.value = res.data;

    }catch(error){
        console.log(error)
    }
}


    const selectedClassName = ref("All classes");
    const selectedClass = ref('');

    const selectClass = (id,name)=>{
        selectedClass.value = id;
        selectedClassName.value = name;
    }
onMounted(getClass);

const getPassPercentage = (test)=>{


   const present = test.marks.filter(mark=>
        mark.status === "Present"
   ).length

   if(present == 0){
    return "-"
   }

   const pass = test.marks.filter(mark=>
        mark.status === "Present" && mark.StdMarks >=(test.maxMarks * 35/100)
   ).length

   return ((pass / present) *100).toFixed(1) + "%"; 
}

    const formatDate = (date) =>{
    if(!date) return "";
    const newdate = new Date(date);
    return newdate.toLocaleDateString('en-GB')  //format date
}

const searchValue = ref("");


const filteredTests = computed(()=>{


    let result = tests.value;

    if(selectedClass.value !== ''){
        result = result.filter(test=>
            String(test.classId) === String(selectedClass.value)
        )
    }
    
    if(searchValue.value !== ''){
        result = result.filter(test=>
            test.name.toLowerCase().includes(searchValue.value.toLowerCase())
        )
    }
    return result;
})



</script>


<style scoped>
.class-dropdown{
    max-height: 200px;
    overflow-y: auto;
}
</style>