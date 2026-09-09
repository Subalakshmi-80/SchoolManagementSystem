<template>
<TeacherNavbar>

<div class="container d-flex flex-column justify-content-center align-items-center mb-3">
<h1 class="fs-4">Edit Marks</h1>
<h2 class="fs-5 text-success fw-bold  text-uppercase"
 v-if="tests && tests.class && tests.class.standard">{{ tests.name }} ({{ tests.class.standard.name }}-{{ tests.class.name }})</h2>



<p  class="text-danger p-4 fw-bold fs-4 " v-if="marks.length === 0">No Marks Found</p>
<div v-else class="mt-3 w-75">

<div class="d-flex justify-content-end align-items-center gap-3 mb-2">

<span class="badge text-bg-success rounded-pill px-3 py-2">P - Present</span>
<span class="badge text-bg-danger rounded-pill px-3 py-2 ">AB - Absent</span>
</div>

<form @submit.prevent="updateMarks()">

<table class="table table-bordered ">

<thead>
<tr class="text-center align-middle">
<th>S.No</th>
<th>Register No</th>
<th>FirstName</th>
<th>LastName</th>
<th>Class</th>
<th>Status</th>
<th>Marks (Max marks:{{ tests.maxMarks }})</th>

</tr></thead>

<tbody>
<tr v-for="(mark,index) in marks" :key="mark.id" class="text-center align-middle" :class="{'table-danger':mark.StdMarks>tests.maxMarks || mark.StdMarks < 0 }">
<td>{{ index+1 }}</td>
<td>{{ mark.student.regNo }}</td>
<td>{{ mark.student.firstName }}</td>
<td>{{ mark.student.lastName }}</td>
<td>{{ mark.test.class.standard.name }}-{{ mark.test.class.name }}</td>

<td>
  <div class="d-flex justify-content-center align-items-center gap-2">
        <button type="button" :class="{ active:mark.status === 'Present'}"
            class="btn btn-outline-success btn-sm px-3"
            @click="mark.status = 'Present'"
            
        >
            P
        </button> 

        <button type="button" :class="{ active:mark.status === 'Absent'}"
            class="btn btn-outline-danger btn-sm px-3"
            @click="mark.status = 'Absent'; mark.StdMarks=null"
            
        >
            AB
        </button>
    
    </div>
</td>
<td >
  <div class="d-flex flex-column justify-content-center align-items-center">
        <input type="number" v-model="mark.StdMarks" required class="form-control w-50"
        :disabled="mark.status==='Absent'"
        :class="invalidMark" @keydown.enter.prevent="moveToNext(index)"
    >

        <small
            v-if="mark.StdMarks> tests.maxMarks"
            class="text-danger fw-bold "
        >Maximum mark is {{ tests.maxMarks }}
        </small>


        <small
    v-else-if="mark.StdMarks < 0"
    class="text-danger fw-bold"
>
    Mark cannot be negative
</small>
    </div>
</td>

</tr>
</tbody>


</table>

<div class="d-flex justify-content-center align-items-center gap-3 mt-5">
<button type="submit" class="btn btn-success fw-bold px-4 py-2">Update Marks</button>
<button @click="router.push('/test/list')" class="btn btn-secondary fw-bold px-4 py-2">Cancel</button>

</div>

</form>


</div>

</div>
</TeacherNavbar>
    </template>


    <script setup>
    import TeacherNavbar from '../../components/TeacherNavbar.vue';
    import {ref,onMounted,computed} from 'vue';
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
    onMounted(getMarks);
   const updateMarks = async()=>{
    try{
        const token = localStorage.getItem("token");
        
            const updateMark = marks.value.map(mark=>({
                studentId:mark.student.id,
                StdMarks:mark.StdMarks,
                status:mark.status
            }))
        const res = await API.put(`/api/tests/${testId}/marks`,{updateMark},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data.message);
        router.push(`/test/viewMarks/${testId}`)
    }catch(err){
        alert(err.response.data.error)
    }
   }

   const invalidMark =computed(() => {
    return marks.value.some(mark => {
        return mark.StdMarks > tests.value.maxMarks || mark.StdMarks < 0
    })
   })

   const moveToNext = (index)=>{
        const inputs = document.querySelectorAll("input[type='number']")

        const nextIndex = index+1;

        if(nextIndex >=inputs.length){
            return;
        }
        if(inputs[nextIndex].disabled){
            moveToNext();
            return;
        }

        inputs[nextIndex].focus();

   }
    </script>