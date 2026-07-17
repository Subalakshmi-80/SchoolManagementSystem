<template>

    <AdminNavbar>

    <div class="student-box">
        <h2>Edit Student</h2>
        <h3>Update student details below.</h3>
        <form @submit.prevent="updateStudent()">
            <div class="form-group">
 <label>Reg Number</label>
            <input type="text" v-model="student.regno" required>
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
                <label >Class</label>
                <select v-model="student.class_id">
                <option disabled value="">Select Class</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.standard_name }} - {{ cls.class_name }}</option>
                </select>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" v-model="student.phone"/>
            </div>

            <div class="form-group">
                <label>Address Line1</label>
                <input type="text" v-model="student.address_line1"/>
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
            <button>Update</button>
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
import {useRouter,useRoute} from 'vue-router';


const router = useRouter();
const route = useRoute();

const stdId = route.params.id;


const student = ref({
    regno:"",
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
});


const classes = ref([]);

const getClasses = async() =>{
try{
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/classes",{
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



const getStudent =async () =>{
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/students/${stdId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        student.value = res.data
        student.value.dob = student.value.dob.split("T")[0]
       

    }catch(err){
        console.log(err)
    }
}

onMounted(getStudent);


const updateStudent =async ()=>{
    try{
        const token = localStorage.getItem("token");
         await axios.put(`http://localhost:5000/api/students/${stdId}`,student.value,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert("Student data Updated successfully!");
        router.push('/studentlist')
        
    }catch(err){
        console.log("Error updating data",err);
        alert("Update Failed")
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
    grid-template-columns:1fr 1fr ;
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
.button-group button{
    width:180px;
    padding:10px;
    border:none;
    border-radius:8px;
    background:rgb(109, 27, 27);
    color:white;
    cursor:pointer;
    font-size:15px;
}

.button-group button:hover{
    background:rgb(139, 43, 43);
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