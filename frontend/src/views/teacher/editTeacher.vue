<template>
    <AdminNavbar>
    
        <div class="teacher-box">
            <h2 class="text-center text-success fw-bold fs-4">Edit Teacher</h2>
            <h3 class="fs-6 text-secondary">Edit the teacher details below.</h3>

            <form @submit.prevent="editTeacher">
                <div class="form-group">
                    <label>Employee ID <span class="text-danger">*</span></label>
                    <input type="text" v-model="teacher.empId" required>
                </div>

              
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" v-model="teacher.firstName">
                </div>

                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" v-model="teacher.lastName">
                </div>

                <div class="form-group">
                    <label>DOB</label>
                    <input type="date" v-model="teacher.dob">
                </div>

                <div class="form-group">
                    <label>Gender</label>

                    <div class="gender-box">
                        <label >
                            <input type="radio" value="Male" v-model="teacher.gender">
                            Male
                        </label>

                        <label >
                            <input type="radio" value="Female" v-model="teacher.gender">
                            Female
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="text" v-model="teacher.phone">
                </div>

            <div class="form-group">
    <label>Class Incharge</label>

    <div class="gender-box">
        <label>
            <input
                type="radio"
                value="Yes"
                v-model="teacher.classIncharge"
            >
            Yes
        </label>

        <label>
            <input
                type="radio"
                value="No"
                v-model="teacher.classIncharge"
            >
            No
        </label>
    </div>
</div>

<div v-if="teacher.classIncharge === 'Yes'" class="form-group">
    <label>Class</label>

    <select v-model="teacher.classSection">
        <option disabled value="">Select Class</option>

        <option
            v-for="cls in classes"
            :key="cls.id"
            :value="`${cls.standard.name}-${cls.name}`"
        >
            {{ cls.standard.name }}-{{ cls.name }}
        </option>
    </select>
</div>
                <div class="form-group">
                    <label>Subject</label>
                   
                   <select v-model="teacher.subject">
                    <option disabled value="">Select Subject</option>
                    <option v-for="sub in subjects" 
                        :key="sub.id"
                        :value="sub.subjectName"
                    >{{ sub.subjectName }}</option>
                   </select>
                </div>

                <div class="form-group">
                    <label>Qualification</label>
                    <input type="text" v-model="teacher.qualification">
                </div>

                <div class="form-group">
                    <label>AddressLine1</label>
                    <input type="text" v-model="teacher.addressLine1">
                </div>

                <div class="form-group">
                    <label>AddressLine2</label>
                    <input type="text" v-model="teacher.addressLine2">
                </div>

                <div class="form-group">
                    <label>City</label>
                    <input type="text" v-model="teacher.city">
                </div>

                <div class="form-group">
                    <label>State</label>
                    <input type="text" v-model="teacher.state">
                </div>

                <div class="d-flex justify-content-center align-items-center gap-3 button-group">
                    
                    <button class="btn btn-outline-success" type="submit">Edit Teacher</button>
                    <button class="btn btn-outline-secondary" type="button"
                        @click="router.push('/teacher/list')">Cancel</button>

                </div >



            </form>
        </div>
    </AdminNavbar>
</template>

<script setup>
import AdminNavbar from '../../components/AdminNavbar.vue';
import {ref,onMounted,watch} from 'vue';
import { useRouter ,useRoute} from 'vue-router';
import API from '../../services/api.js';

const router = useRouter();
const route = useRoute();

const teacher = ref({})
const getTeacher = async() =>{
    const teacherId = route.params.id;

    try{
        const token = localStorage.getItem("token");

        const res = await API.get(`/api/teacher/${teacherId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        teacher.value = res.data;

    }catch(err){
        console.log("Error fetching teacher",err.response);
    }

}

onMounted(getTeacher);


const classes = ref([]);

const getClass = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res=await API.get('/api/classes',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value = res.data;
    }catch(err){
        console.log("Error fetching classes",err.response)
    }
}

onMounted(getClass);

const subjects = ref([]);

const getSubjects = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res= await API.get("/api/subjects",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        subjects.value = res.data
    }catch(err){
        console.log("Error fetching subjects",err.response)
    }
}
onMounted(getSubjects);


const editTeacher = async()=>{
    const teacherId = route.params.id
    try{
        const token = localStorage.getItem("token");

        const res = await API.put(`/api/teacher/${teacherId}`,teacher.value,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        alert(res.data.message);
        router.push('/teacher/list');
    }catch(err){
        console.log(err.response)
        alert(err.response?.data?.error || "Failed to create teacher");
    }
}

watch(() => teacher.value.classIncharge, (value) => {
    if (value === "No") {
        teacher.value.classSection = "";
    }
});
</script>

<style scoped>

.teacher-box {
    width: 900px;
    margin: 40px auto;
}

.teacher-box h2 {
    font-size: 30px;
    color: rgb(85, 28, 17);
    margin-bottom: 20px;
    text-align: center;
}

.teacher-box h3 {
    font-size: 20px;
    color: rgb(61, 61, 61);
    margin-bottom: 30px;
    text-align: center;
}

.teacher-box form {
    background-color: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: bold;
    margin-bottom: 8px;
}
.form-group select {
    padding: 10px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
    font-size: 15px;
}
.form-group input {
    padding: 10px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
    font-size: 15px;
}

.form-group input:focus {
    outline: none;
}

.gender-box {
    display: flex;
    gap: 20px;
    align-items: center;
}

.button-group {
    grid-column: 1 / -1;
    justify-self: center;
    width: auto;
}


</style>