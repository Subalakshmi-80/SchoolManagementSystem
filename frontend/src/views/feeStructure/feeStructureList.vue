<template>
    <AdminNavbar>
        <div>
            <div class="d-flex justify-content-between align-items-center px-5 mt-3">
                <h1 class="fs-4 text-success text-center">Fees Structure</h1>

                <button class="btn btn-success fw-bold">
                    <i class="bi bi-plus-lg me-2"></i>
                    Add Fee Structure
                </button>
            </div>

            <div class="d-flex justify-content-between align-items-center px-5 mt-3">
                <div class="dropdown">
                    <button
                        class="btn btn-outline-secondary  dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        Academic Year
                    </button>

                    <ul class="dropdown-menu">
                        <li v-for="academicYear in academicYears">
                            <button class="dropdown-item">{{ academicYear.name }}</button>
                        </li>
                    </ul>
                </div>
            </div>


            <div class="px-5 mt-2">
                <div v-if="feeStructures.length === 0" class="text-danger text-center fw-bold">Fees Structure not found.</div>
                <table class="table table-responsive table-hover" v-else>
                
                    <thead>
                    
                        <tr class="text-center align-middle">
                            <th>Academic Year</th>
                            <th>Standard</th>
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                    
                        <tr v-for="fee in feeStructures" :key="fee.id" class="text-center align-middle">
                            <td>{{ fee.academicYear.name }}</td>
                            <td>{{ fee.standard.name }}</td>
                            <td>{{ fee.feeType }}</td>
                            <td><i class="bi bi-currency-rupee"></i>{{ fee.amount }}</td>
                            <td>{{formatDate( fee.dueDate) }}</td>

                            <td>
                                  <div class="d-flex justify-content-center align-items-center gap-3">
                                    <i class="bi bi-pencil-square text-primary pointer" ></i>
                                    <i class="bi bi-trash3-fill text-danger pointer" ></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    
    </AdminNavbar>
</template>

<script setup>

    import AdminNavbar from '../../components/AdminNavbar.vue';

    import {ref,onMounted} from 'vue';
    import { useRouter } from 'vue-router';
import API from '../../services/api.js';

    const router = useRouter();

    const feeStructures = ref([]);

    const getFeeStructures = async()=>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get('/api/feestructures',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            feeStructures.value = res.data;
            console.log(feeStructures.value)
        }catch(err){
            console.log(err.response.data.error);
        }
    }
    onMounted(getFeeStructures);

   const formatDate = (date) => {
    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

const academicYears = ref([])

const getAcademicYears = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/academicyears",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        academicYears.value = res.data

    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getAcademicYears)
</script>