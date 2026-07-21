<template>

    <AdminNavbar>
        <div class="standard-list">
            <div class="page-header">
                <h1>Standard List</h1>
                <button @click="router.push('/standard/create')">Add Standard</button>
            </div>
<p v-if="standards.length === 0">No standards Found</p>
            <table v-else>
                <thead>
                    <tr>
                     
                        <th>Standard Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="standard in standards" :key="standard.id">
                       
                        <td>{{ standard.name }}</td>
                        <td>
                            <div class="action-button">
                                <button @click="router.push(`/standard/edit/${standard.id}`)">Edit</button>
                                <button @click="deleteStandard(standard.id)">Delete</button>
                            </div>
                           
                        </td>
                    </tr>
                </tbody>
                            
            </table>



        </div>
    </AdminNavbar>
    </template>

    <script setup>
import AdminNavbar from '../components/AdminNavbar.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import {ref,onMounted} from 'vue';
import API from "../services/api.js"


const standards = ref([]);
const router = useRouter();


const getStandards = async() =>{
try{
    const token = localStorage.getItem("token");

    const res = await API.get("api/standards",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
  standards.value=res.data;
}catch(err){
console.log("Error Fetching Standards",err);
}
}
onMounted(getStandards)


const deleteStandard = async(id) =>{
    const confirmDelete = confirm("Are you sure you want to delete this standard? ")
if(!confirmDelete){
    return
}
    try{
        const token = localStorage.getItem("token");
       const res= await API.delete(`/api/standards/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
      
        alert(`${res.data.name} deleted successfully`);
        await getStandards()
    }
    catch(err){
        console.log("Error deleting data",err)
    }
}

</script>


<style scoped>
.standard-list{
    padding: 20px;
}
.page-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

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
 width: 60%;
    border-collapse: collapse;
    background: rgb(255, 255, 255);
    border-radius: 10px;
    overflow-x: auto;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin:30px auto;
}
table th,td{
    border:1px solid rgb(136, 132, 132);
    text-align: center;
    padding: 10px;
    font-size: 17px;
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
.action-button{
    display: flex;
    justify-content: center;
    gap:20px;
}
</style>