<template>
<TeacherNavbar>
<div class="container d-flex flex-column justify-content-center align-items-center my-3">
<h1>Add Marks</h1>
<h2 class="fs-2 text-success fw-bold my-2 text-uppercase"
 v-if="tests && tests.class && tests.class.standard">
{{ tests.name }} ({{tests.class.standard.name}}-{{ tests.class.name }})</h2>

<button class="btn btn-outline-secondary fw-bold px-3" @click="router.push('/test/list')">Back</button>
<p  class="text-danger p-4 fw-bold fs-4 " v-if="students.length === 0">No Students Found</p>
<div v-else class="mt-3 w-75">

<div class="d-flex justify-content-end align-items-center gap-3 mb-2">

<span class="badge text-bg-success rounded-pill px-3 py-2">P - Present</span>
<span class="badge text-bg-danger rounded-pill px-3 py-2 ">AB - Absent</span>
</div>
<form @submit.prevent="saveMarks()">

<table class="table table-bordered ">

<thead>
<tr class="text-center align-middle">
<th >S.No</th>
<th>Register No</th>
<th>FirstName</th>
<th>LastName</th>
<th>Class</th>
<th>Status</th>
<th >Marks (Max mark: {{ tests.maxMarks }})</th>

</tr></thead>

<tbody>
<tr v-for="(student,index) in students" :key="student.id" class="text-center align-middle" :class="{ 'table-danger':student.mark > tests.maxMarks || student.mark<0 }">
<td>{{ index+1 }}</td>
<td>{{ student.regNo }}</td>
<td>{{ student.firstName }}</td>
<td>{{ student.lastName }}</td>
<td>{{student.class.standard.name}}-{{ student.class.name }}</td>
<td>
    <div class="d-flex justify-content-center align-items-center gap-2">
        <button type="button" :class="{ active:student.status === 'Present'}"
            class="btn btn-outline-success btn-sm px-3"
            @click="student.status = 'Present'"
            
        >
            P
        </button> 

        <button type="button" :class="{ active:student.status === 'Absent'}"
            class="btn btn-outline-danger btn-sm px-3"
            @click="student.status = 'Absent'; student.mark=null"
            
        >
            AB
        </button>
    
    </div>
</td>

<td>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <input type="number" v-model="student.mark" required class="form-control w-50"
        :disabled="student.status==='Absent'"
        :class="invalidMark" @keydown.enter.prevent="moveToNext(index)"
    >

        <small
            v-if="student.mark > tests.maxMarks"
            class="text-danger fw-bold "
        >Maximum mark is {{ tests.maxMarks }}
        </small>

        <small
    v-else-if="student.mark < 0"
    class="text-danger fw-bold"
>
    Mark cannot be negative
</small>
    </div>

</td>


</tr>

</tbody>


</table>

<div class="d-flex justify-content-center align-items-center mt-5 gap-4">
    <button type="submit" :disabled="invalidMark" class="btn btn-success fw-bold px-4 py-2">Save Marks</button>
    <button type="button" @click="router.push('/test/list')" class="btn btn-secondary fw-bold px-4 py-2">Cancel</button>

</div>

</form>


    </div>

    </div>

    </TeacherNavbar>
</template>



    <script setup>
    
    import TeacherNavbar from '../../components/TeacherNavbar.vue';
    import {onMounted, ref,computed} from 'vue';
    import {useRoute,useRouter} from 'vue-router';
    import API from "../../services/api.js"



    const route = useRoute();
    const router =useRouter();
    const testId   = route.params.id;

    const tests = ref({})
    const getTest=async()=>{
        try{
            const token = localStorage.getItem("token");

            const res= await API.get(`/api/tests/${testId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            
            tests.value = res.data;
         
        }catch(err){
            console.log(err)
        }
    }


    onMounted(getTest)

    const students=ref([])

    const getStudents = async() =>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get(`/api/tests/${testId}/students`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            
            students.value = res.data.map(student=>({
                ...student,
                status:"Present"
            }))
         
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
                mark:student.mark,
                status:student.status
        }))

        const res = await API.post(`/api/tests/${testId}/marks`,{marks},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
    
        alert(res.data.message);
        router.push('/test/list')
        }catch(err){
          
            alert(err.response.data.error);
         
           
        }
    }

    const invalidMark = computed(()=>{
  
        return students.value.some(student =>{
            return student.mark > tests.value.maxMarks || student.mark <0
         })
    });

   
    const moveToNext =(index)=>{
        const inputs = document.querySelectorAll("input[type='number']");

        const nextIndex = index + 1;

        if(nextIndex >= inputs.length){
            return;
        }
         if(inputs[nextIndex].disabled){
            moveToNext(nextIndex);
            return;
        }
            inputs[nextIndex].focus();
              
    }
    </script>