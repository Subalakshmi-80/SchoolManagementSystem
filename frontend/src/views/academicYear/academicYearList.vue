<template>
<AdminNavbar>

    <div>
    
        <div class="d-flex justify-content-between align-items-center px-5">
            <h1 class="text-success fs-4 fw-bold">Academic Year</h1>
            <button class="btn btn-success fw-bold" @click="router.push('/academic-year/create')">+ Add Academic Year</button>
        </div>

        <div class="px-5 py-3">
            <div class="text-center fw-bold text-danger" v-if="academicYears.length ===0 ">Academic Years not found.</div>

            <div v-else class="d-flex  justify-content-center align-items-center">
                <table class="table table-hover table-responsive w-75">
                
                    <thead>
                        <tr class="text-center align-middle">
                            <th>Academic Year</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    
                    </thead>

                    <tbody>
                    
<tr
    v-for="academicyear in academicYears"
    :key="academicyear.id"
    class="text-center align-middle"
    :class="{ 'table-success': academicyear.isActive }"
>
                            <td>{{ academicyear.name }}</td>
                            <td>{{ formatDate(academicyear.startDate) }}</td>
                            <td>{{formatDate(academicyear.endDate) }}</td>
                          <td>
    <span
        class="badge"
        :class="academicyear.isActive ? 'bg-success' : 'bg-secondary'"
    >
        {{ academicyear.isActive ? 'Active' : 'Inactive' }}
    </span>
</td>
                            <td>

                            <div class="d-flex justify-content-center align-items-center gap-3">
                            <i class="bi bi-pencil-square text-primary pointer" @click="router.push(`/academic-year/edit/${academicyear.id}`)"></i>
                            <i class="bi bi-trash3-fill text-danger pointer" @click="deleteAcademicYear(academicyear.id)"></i>
                            </div>
                            
                            </td>
                        
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</AdminNavbar>
</template>

<script setup>
import AdminNavbar from '../../components/AdminNavbar.vue';
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

import API from '../../services/api.js';

const academicYears = ref([]);

const getAcademicYear = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get('/api/academicyears',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        academicYears.value = res.data;

        
    }catch(err){
        alert(err.response.data.error)
    }
}
onMounted(getAcademicYear);

const formatDate = (date) => {
    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

const deleteAcademicYear = async(id)=>{

    try{
        const confirmDelete = confirm("Are you sure you want to delete the academic year?")

        if(!confirmDelete){
            return
        }
        const token = localStorage.getItem("token");
        const res = await API.delete(`/api/academicyears/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data.message);
        getAcademicYear();
    }catch(err){
        alert(err.response.data.error)
    }

}
</script>