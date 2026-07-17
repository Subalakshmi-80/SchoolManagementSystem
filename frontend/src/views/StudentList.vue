<template>

   <AdminNavbar>
    
    <div class="student-list">
<div class="page-header">
        <h1>Students List</h1>
        <button @click="router.push(`/student/create`)">Add Student</button>
</div>
<p v-if="students.length === 0">No students Found</p>
<table v-else>
    <thead>
        <tr>
            <th>Reg No</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Class</th>
            <th>Phone</th>
            <th>AddressLine1</th>
            <th>AddressLine2</th>
            <th>City</th>
            <th>State</th>
            <th>Actions</th>

           

        </tr>
    </thead>

    <tbody>
<tr v-for="student in students" :key="student.id">

    <td>{{student.regno}}</td>
    <td>{{student.name}}</td>
    <td>{{student.email}}</td>
    <td>{{student.gender}}</td>
    <td>{{formatDate(student.dob)}}</td>
    <td>{{student.class_name}}</td>
  
    <td>{{student.phone}}</td>
    <td>{{student.address_line1}}</td>
    <td>{{student.address_line2}}</td>
    <td>{{ student.city }}</td>
    <td>{{ student.state }}</td>

    <td>
        <button @click="router.push(`/student/edit/${student.id}`)">Edit</button>
        <button @click="deleteStudent(student.id)">Delete</button>
    </td>


</tr>

    </tbody>
</table>


</div>
</AdminNavbar>
    
</template>


<script setup>

import AdminNavbar from "../components/AdminNavbar.vue";


import axios from "axios";
import {ref,onMounted} from 'vue';
import {useRouter} from 'vue-router'


const router = useRouter();

const students = ref([]);


const  getStudents = async() =>{
try{
    const token = localStorage.getItem("token");
    
    const res = await axios.get("http://localhost:5000/api/students",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    
    })
    students.value= res.data
     console.log(students.value)
   
    
}catch(err){
console.log("Error Fetching Students ",err)
}
}
onMounted(getStudents);
  

const formatDate = (date) =>{
    if(!date) return "";
    const newdate = new Date(date);
    return newdate.toLocaleDateString('en-GB')  //format date
}


//deletestudents

const deleteStudent = async(stdId) =>{
    try{
        const token = localStorage.getItem("token");
       const res= await axios.delete(`http://localhost:5000/api/students/${stdId}`,{
             headers:{
            Authorization:`Bearer ${token}`
        }
       
        })

      
         alert(`Student data deleted successfully`)
await getStudents();
    }catch(err){
         console.log("Error Deleting Data",err)
    }

}
</script>


<style scoped>
.student-list{
    padding:20px;
}
.page-header{
    display:flex;
    justify-content:space-between;
    padding:20px;
    align-items:center;
}
.page-header h1{
     font-size:35px;
      color:rgb(97, 32, 19);
}
.page-header button{
    margin:10px 60px;
    padding:10px 35px; 
    background-color: rgb(102, 30, 30);
    color:white;
    border:none;
    border-radius:7px;
    cursor:pointer;
    font-size:15px;
}
 button:hover{
    background-color: rgb(177, 81, 81);
}

table{
     width: 100%;
    border-collapse: collapse;
    background: rgb(255, 255, 255);
    border-radius: 10px;
    overflow-x: auto;
    display: block;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

table th,td{
    border:1px solid rgb(136, 132, 132);
    text-align: center;
    padding: 6px;
    font-size: 14px;
}
table td button{
    min-width:100px;
    padding:10px 30px; 
    background-color: rgb(102, 30, 30);
    color:white;
    border:none;
    border-radius:7px;
    cursor:pointer;
    font-size:15px;
    margin-bottom:10px;
}
</style>
