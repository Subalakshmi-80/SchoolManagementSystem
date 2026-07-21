<template>

    <AdminNavbar>

    <div class="student-box">
        <h2>Add Student</h2>
        <h3>Fill in the student details below.</h3>
        <form @submit.prevent="saveStudent()">
            <div class="form-group">
            <label>Reg Number <span class="text-danger">*</span></label>
            <input type="text" v-model="student.regno" required>
            </div>

            <div class="form-group">
                <label>Full Name <span class="text-danger">*</span></label>
                <input type="text" required v-model="student.name">

            </div>

            <div class="form-group">
                <label>Email <span class="text-danger">*</span></label>
                <input type="email" required v-model="student.email">
            </div>

            <div class="form-group">
                <label>Password <span class="text-danger">*</span></label>
                <input type="password" required v-model="student.password">
            </div>

            <div class="form-group">
                <label>First Name</label>
                <input type="text" v-model="student.first_name"/>
            </div>
           
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" v-model="student.last_name"/>
            </div>

            <div class="form-group">
                <label>DOB</label>
                <input type="date" v-model="student.dob"/>
            </div>

               <div class="form-group">
                <label >Class <span class="text-danger">*</span></label>
                <select v-model="student.class_id" required>
                <option disabled value="">Select Class</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{cls.standard_name}}-{{ cls.class_name }}</option>
                </select>
            </div>


            <div class="form-group">
                    <label>Gender</label>
                        <div class="gender-box">

                            <label>
                                <input type="radio"  value="Male" v-model="student.gender"/>Male
                            </label>

                            <label>
                                <input type="radio"  value="Female" v-model="student.gender"/>Female
                            </label>

                </div>

            </div>

         
            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" v-model="student.phone"/>
            </div>

            <div class="form-group">
                <label>Address Line1</label>
                <input type="text" v-model="student.address_line1">
            </div>

             <div class="form-group">
                <label>Address Line2</label>
                <input type="text" v-model="student.address_line2"/>
            </div>

            <div class="form-group">
                <label>City</label>
                <input v-model="student.city"/>
            </div>

             <div class="form-group">
                <label>State</label>
                <input v-model="student.state"/>
            </div>

            <div class="button-group">
<button>Save Student</button>
            <button type="button" @click="router.push('/studentlist')">Cancel</button>
            </div>

            
        </form>
    </div>
    </AdminNavbar>
    </template>


<script setup>
 import AdminNavbar from '../components/AdminNavbar.vue';
 import {ref,onMounted} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
import API from "../services/api.js"

const router = useRouter();

const classes = ref([]);

const getClasses = async() =>{
try{
    const token = localStorage.getItem("token");

    const res = await API.get("/api/classes",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    classes.value = res.data;

}catch(err){
    console.log(err)
}
}

onMounted(getClasses)
 const student = ref({
    regno:"",
    name:"",
    email:"",
    password:"",
    first_name:"",
    last_name:"",
    gender:"",
    dob:"",
    class_id:"",
    phone:"",
    address_line1:"",
    address_line2:"",
    city:"",
    state:""

 })


const saveStudent = async() =>{
    try{
        const token = localStorage.getItem("token");
        
        const res = await API.post("/api/students",student.value,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )
        
        alert("Student Added Successfully");
        router.push("/studentlist")

    }
    catch(err){
        console.log("Error fetching data",err)

        alert(err.response.data)
    }
}
 
</script>


<style scoped>
.student-box{
    width:900px;
    margin: 40px auto;
   
    
}
.student-box h2,h3{
     font-size:30px;
      color:rgb(85, 28, 17);
      margin-bottom: 30px;
      text-align: center;
}
.student-box h3{
    font-size: 20px;
    color:rgb(61, 61, 61)
}
.student-box form{
    background-color: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
     display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
}
.button-group{
    grid-column: 1/3;
   
     width:100%;
    display:flex;
    justify-content:center;
    gap:20px;
    margin-top:30px;
}
.student-box form button{
  
    padding:10px 35px; 
    background-color: rgb(102, 30, 30);
    color:white;
    border:none;
    border-radius:7px;
    cursor:pointer;
    font-size:15px;
}
.student-box form button:hover{
    background-color: rgb(177, 81, 81);
}

.form-group{
    display: flex;
    flex-direction: column;
}
.form-group label{
    font-weight: bold;
    margin-bottom: 8px;
}
.form-group input,textarea{
    padding: 10px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
    font-size: 15px;
}
.form-group input:focus,textarea:focus{
    outline: none;
}
.form-group .gender-box{
    display: flex;
    gap:20px;
    align-items: center;
}
</style>