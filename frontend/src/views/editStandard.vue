<template>

    <AdminNavbar>

    <div class="standard-box">
         <h2>Edit Standard</h2>
        <h3>Update standard details below.</h3>

         <form @submit.prevent="updateStandard()">
                <div class="form-group">
                    <label>Standard Name</label>
                    <input type="text" v-model="standard.name" required/>
                </div>

                <div class="button-group">
                    <button>Update</button>
                    <button type="button" @click="router.push('/standardlist')">Cancel</button>
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
import API from "../services/api.js"

const router = useRouter();
const route = useRoute();

const standard = ref({
    name:""
})

const id = route.params.id
const getStandard = async() =>{
    try{

    const token = localStorage.getItem("token");
    const res = await API.get(`/api/standards/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    standard.value = res.data[0];
   
    }catch(err){
        console.log(err)
    }
    
}

onMounted(getStandard);

const updateStandard = async() =>{
    try{
        const token = localStorage.getItem("token");

        await API.put(`/api/standards/${id}`,standard.value,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert("Standard updated Successfully");
        router.push('/standardlist')

    }catch(err){
 console.log("Error updating data",err);
        alert("Update Failed")
    }
}
</script>

<style scoped>
.standard-box{
    width:500px;
    margin: 60px auto;
}
.standard-box h2,h3{
     font-size:30px;
      color:rgb(85, 28, 17);
      margin-bottom: 30px;
      text-align: center;
}
.standard-box h3{
    font-size: 20px;
    color:rgb(61, 61, 61)
}
.standard-box form{
    background-color: white;
    padding: 40px;
    border-radius: 10px;
   
}
.standard-box form .button-group{
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
.standard-box .form-group{
    display: flex;
    flex-direction: column;
}
.standard-box label{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}
.standard-box input{
    padding: 10px;
    border:1px solid rgb(180, 180, 180);
    border-radius: 5px;
    font-size: 15px;
}
.standard-box input:focus{
    outline: none;
}

</style>