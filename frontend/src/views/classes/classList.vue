<template>

    <AdminNavbar>
        <div class="class-list">

            <div class="page-header">
                <h1>Class List</h1>
                <button @click="router.push('/class/create')">Add Class</button>

            </div>
            <p v-if="classes.length === 0">Class not found.</p>

            <table v-else>
                <thead>
                    <tr>
                        <th>Standard</th>
                        <th>Class</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="cls in classes" :key="cls.id">
                         <td>{{ cls.standard_name }}</td>
                        <td>{{ cls.class_name }}</td>
                       
                        <td>
                            <div class="action-button">
                                <button @click="router.push(`/class/edit/${cls.id}`)">Edit</button>
                                <button @click ="deleteClass(cls.id)">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </AdminNavbar>
    </template>


<script setup>
import AdminNavbar from '../../components/AdminNavbar.vue';
import {ref,onMounted} from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router';
import API from "../../services/api.js"

const router = useRouter();

const classes = ref([])

const getClass = async() =>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/classes",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value = res.data;
      
    }catch(err){
        console.log("Error Fetching classes",err);
    }
}
onMounted(getClass);

const deleteClass = async(id) =>{
    const confirmDelete = confirm("Are you sure you want to delete this class?" )

    if(!confirmDelete){
        return
    }
    try{
        const token = localStorage.getItem("token");

        const res = await API.delete(`/api/classes/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert("Class Deleted Successfully");
        await getClass();
    }catch(err){
        console.log("Error deleting data",err)
    }
}
</script>

<style scoped>

.class-list{
    padding: 20px;
}
.page-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;;
}
.page-header h1{
    font-size: 35px;
    color:rgb(97,32,19);
}

.page-header button{
    margin: 10px 60px;
    padding: 10px 35px;
    background-color: rgb(102, 30, 30);
    color:white;
    border:none;
    border-radius: 7px;
    cursor: pointer;
    font-size: 15px;

}
button:hover{
    background-color: rgb(177, 81, 81);

}

table{
    width:60%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin: 30px auto;
    border-radius: 10px;
}

table th,td{
    border:1px solid rgb(136,132,132);
    text-align: center;
    padding: 10px;
    font-size: 17px;
}
table td button{
    padding: 10px 30px;
    background-color: rgb(102, 30, 30);
    color:white;
    border:none;
    border-radius:7px;
    cursor:pointer;
    font-size: 15px;
    margin-bottom: 10px;

}
.action-button{
    display: flex;
    justify-content: center;
    align-items: center;
    gap:20px
}
</style>

