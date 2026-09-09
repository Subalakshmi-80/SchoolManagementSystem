<template>

    <AdminNavbar>
        <div class="class-box">
             <h2>Edit Class</h2>
        <h3>Update class details below.</h3>

        <form @submit.prevent="editClass()">

            <div class="form-group">
                <label>Class</label>
                  <input type="text"  v-model="classes.name" required>
            </div>

                            <div class="form-group">
                    <label>Standard</label>
                    <select v-model="classes.standardId" required>
                        <option disabled value="">Select Standard</option>
                        <option v-for="standard in standards" :key="standard.id" :value="standard.id">
                            {{ standard.name }}
                        </option>

                    </select>
                </div>

                  <div class="button-group">
                    <button>Save Class</button>
                    <button type="button" @click="router.push('/class/list')">Cancel</button>
                </div>
        </form>
        </div>

    </AdminNavbar>
    </template>

    <script setup>
import AdminNavbar from '../../components/AdminNavbar.vue';
import axios from 'axios';
import { useRouter ,useRoute } from 'vue-router';
import {ref,onMounted} from 'vue';
import API from "../../services/api.js"

const router = useRouter();
const route = useRoute();

const standards = ref([])

const getStandards = async() =>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/standards",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        standards.value = res.data
    }catch(err){
        console.log("Error fetching data",err)
    }
}

onMounted(getStandards)

const classes = ref({
    name:"",
    standardId:"",
    standard:{
        name:""
    }
    
})
 const clsId = route.params.id
 
const getClass = async() =>{
  
    try{
        const token = localStorage.getItem("token");
        const res = await API.get(`/api/classes/${clsId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value = res.data
       
       
    }catch(err){
        console.log("Error fetching data",err)
    }
}
onMounted(getClass);


const editClass = async() =>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.put(`/api/classes/${clsId}`,classes.value,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        
        alert(res.data.message);
        router.push('/class/list')
    }catch(err){
        console.log(err.response)
        alert(err.response.data.error)
    }
}
</script>


<style setup>
.class-box{
    width:500px;
    margin: 60px auto;
}
.class-box h2,h3{
     font-size:30px;
      color:rgb(85, 28, 17);
      margin-bottom: 30px;
      text-align: center;
}
.class-box h3{
    font-size: 20px;
    color:rgb(61, 61, 61)
}
.class-box form{
    background-color: white;
    padding: 40px;
    border-radius: 10px;

}

.class-box form .button-group{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap:20px
}

.button-group button{
        background-color: rgb(102, 30, 30);
        padding: 10px 30px;
        border: none;
        color: white;
        border-radius: 7px;
   cursor:pointer;
    font-size:15px;
}
.button-group button:hover{
    background-color: rgb(177, 81, 81);
}

.class-box .form-group{
    display: flex;
    flex-direction: column;
}
.class-box label{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}
.class-box input,select{
    padding: 10px;
    border:1px solid rgb(180, 180, 180);
    border-radius: 5px;
    font-size: 15px;
}
.class-box input:focus,select:focus{
    outline: none;
}
</style>