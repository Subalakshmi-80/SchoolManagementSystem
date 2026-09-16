<template>
    <AdminNavbar>
        <div>
            <div class="d-flex justify-content-between align-items-center px-5 mt-3">
                <h1 class="fs-4 text-success text-center">Fees Structure</h1>

                <button class="btn btn-success fw-bold" @click="router.push('/fees-structure/create')">
                    <i class="bi bi-plus-lg me-2"></i>
                    Add Fee Structure
                </button>
            </div>

            <div class="d-flex align-items-center px-5 my-4 gap-3">
                <div class="dropdown">
                    <button
                        class="btn btn-outline-secondary  dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {{ selectedAcademicYear ? selectedAcademicYear.name : "All Academic Years" }}
                    </button>

                    <ul class="dropdown-menu">

                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                @click="selectedAcademicYear = null"
                            >
                                All Academic Years
                            </button>
                        </li>

                        <li v-for="academicYear in academicYears">
                            <button class="dropdown-item"  type="button" @click="selectedAcademicYear=academicYear">
                            {{ academicYear.name }}</button>
                        </li>
                    </ul>
                </div>

                <div class="dropdown">
                    <button
                        class="btn btn-outline-secondary  dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {{ selectedStandard ? selectedStandard.name : "All Standard" }}
                    </button>

                    <ul class="dropdown-menu">

                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                @click="selectedStandard = null"
                            >
                                All Standards
                            </button>
                        </li>
                        <li v-for="standard in standards">
                            <button class="dropdown-item" type="button" @click="selectedStandard=standard">
                            {{ standard.name }}</button>
                        </li>
                    </ul>
                </div>

                 <div class="dropdown">
                    <button
                        class="btn btn-outline-secondary  dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {{ selectedFeeType ? selectedFeeType : "All Fees Types" }}
                    </button>

                    <ul class="dropdown-menu">
                        <li>
                            <button class="dropdown-item" type="button" @click="selectedFeeType = null">
                            All Fees Types
                            </button>
                        </li>
                        <li v-for="fees in feeTypes">
                            <button class="dropdown-item" type="button" @click="selectedFeeType=fees">
                            {{ fees }}</button>
                        </li>
                    </ul>
                </div>

                <button
    type="button"
    class="btn btn-outline-danger"
    @click="clearFilters"
>
    Clear All Filters
</button>
            </div>


            <div class="px-5 mt-2">
                <div v-if="filterFees.length === 0" class="text-danger text-center fw-bold">Fees Structure not found.</div>
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
                    
                        <tr v-for="fee in filterFees" :key="fee.id" class="text-center align-middle">
                            <td>{{ fee.academicYear.name }}</td>
                            <td>{{ fee.standard.name }}</td>
                            <td>{{ fee.feeType }}</td>
                            <td><i class="bi bi-currency-rupee"></i>{{ fee.amount }}</td>
                            <td>{{formatDate( fee.dueDate) }}</td>

                            <td>
                                  <div class="d-flex justify-content-center align-items-center gap-3">
                                    <i class="bi bi-pencil-square text-primary pointer" @click="router.push(`/fees-structure/edit/${fee.id}`)"></i>
                                    <i class="bi bi-trash3-fill text-danger pointer" @click="deleteFeeStructure(fee.id)"></i>
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

    import {ref,onMounted,computed} from 'vue';
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
       
        }catch(err){
            console.log(err.response.data.error);
        }
    }
    onMounted(getFeeStructures);
const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const academicYears = ref([])
const selectedAcademicYear = ref(null);

const getAcademicYears = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/academicyears",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        academicYears.value = res.data;

        const activeYear = academicYears.value.find(year=>year.isActive);
        
        if(activeYear){
            selectedAcademicYear.value = activeYear;
        }

    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getAcademicYears);

const standards = ref([]);

const selectedStandard = ref(null);

const getStandards = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/standards",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        standards.value = res.data;
    }catch(err){
        console.log(err.response.data.error);
    }
}

onMounted(getStandards);
const selectedFeeType = ref(null);

const feeTypes = [
    "Tuition Fees",
    "Exam Fees",
    "Books Fees",
    "Uniform Fees"
];

const filterFees = computed(() => {

    const result = feeStructures.value.filter(fees => {

        if (selectedAcademicYear.value) {
            if (fees.academicYearId !== selectedAcademicYear.value.id) {
                return false;
            }
        }

        if (selectedStandard.value) {
            if (fees.standardId !== selectedStandard.value.id) {
                return false;
            }
        }

        if (selectedFeeType.value) {
            if (fees.feeType !== selectedFeeType.value) {
                return false;
            }
        }

        return true;
    });

     result.sort((a, b) => {

    if (a.academicYearId !== b.academicYearId) {
        return b.academicYearId - a.academicYearId;
    }

    if (a.standardId !== b.standardId) {
        return a.standardId - b.standardId;
    }

    return a.feeType.localeCompare(b.feeType);
});

    return result;
});


const clearFilters = () => {
    const activeYear = academicYears.value.find(year => year.isActive);

    selectedAcademicYear.value = activeYear || null;
    selectedStandard.value = null;
    selectedFeeType.value = null;
};

const deleteFeeStructure = async(id)=>{

    const confirmDelete = confirm("Are you sure you want to delete this fees structure?");

    if(!confirmDelete){
        return
    }
    try{
        const token = localStorage.getItem("token");

        const res = await API.delete(`/api/feestructures/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        alert(res.data.message);
        await getFeeStructures();
    }catch(err){
        alert(err.response.data.error)
    }
}

</script>

<style>
.dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
}

</style>