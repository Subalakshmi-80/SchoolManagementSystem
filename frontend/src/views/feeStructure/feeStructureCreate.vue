<template>
    <AdminNavbar>

        <div class="container-fluid px-4 py-3">

            <h1 class="fs-4 text-success text-center fw-bold mb-4">
                Add Fees Structure
            </h1>

            <div class="fee-form-card mx-auto">

                <form @submit.prevent="createFeeStructure">

                    <div class="row g-4">

                        <div class="col-md-6">
                            <label class="form-label fw-semibold">
                                Academic Year
                            </label>

                            <div class="dropdown">
                                <button
                                    class="btn border-secondary dropdown-toggle w-100 text-start"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {{
                                        selectedAcademicYear
                                            ? selectedAcademicYear.name
                                            : "Select Academic Year"
                                    }}
                                </button>

                                <ul class="dropdown-menu w-100">
                                    <li
                                        v-for="academicYear in academicYears"
                                        :key="academicYear.id"
                                    >
                                        <button
                                            class="dropdown-item"
                                            type="button"
                                            @click="selectedAcademicYear = academicYear"
                                        >
                                            {{ academicYear.name }}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="errors.academicYear" class="text-danger small mt-1">
                                {{ errors.academicYear }}
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-semibold">
                                Standard
                            </label>

                            <div class="dropdown">
                                <button
                                    class="btn border-secondary dropdown-toggle w-100 text-start"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {{
                                        selectedStandard
                                            ? selectedStandard.name
                                            : "Select Standard"
                                    }}
                                </button>

                                <ul class="dropdown-menu w-100">
                                    <li
                                        v-for="standard in standards"
                                        :key="standard.id"
                                    >
                                        <button
                                            class="dropdown-item"
                                            type="button"
                                            @click="selectedStandard = standard"
                                        >
                                            {{ standard.name }}
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div v-if="errors.standard" class="text-danger small mt-1">
                                {{ errors.standard }}
                            </div>
                        </div>


                     
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">
                                Fee Type
                            </label>

                            <div class="dropdown">
                                <button
                                    class="btn border-secondary dropdown-toggle w-100 text-start"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {{
                                        selectedFeeType
                                            ? selectedFeeType
                                            : "Select Fee Type"
                                    }}
                                </button>

                                <ul class="dropdown-menu w-100">
                                    <li
                                        v-for="feeType in feesTypes"
                                        :key="feeType"
                                    >
                                        <button
                                            class="dropdown-item"
                                            type="button"
                                            @click="selectedFeeType = feeType"
                                        >
                                            {{ feeType }}
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div v-if="errors.feeType" class="text-danger small mt-1">
                                {{ errors.feeType }}
                            </div>
                        </div>


                      
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">
                                Amount
                            </label>

                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-currency-rupee"></i>
                                </span>

                                <input
                                    type="number"
                                    class="form-control"
                                    placeholder="Enter amount" v-model="amount"
                                >
                            </div>

                            <div v-if="errors.amount" class="text-danger small mt-1">
                                {{ errors.amount }}
                            </div>
                        </div>


                        <div class="col-md-6">
                            <label class="form-label fw-semibold">
                                Final Due Date
                            </label>

                            <input
                                type="date"
                                class="form-control" v-model="dueDate"
                            >
                        </div>
                     
                    </div>


                    <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">

                        <button
                            type="button"
                            class="btn btn-outline-secondary fw-bold px-4"
                            @click="router.back()"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="btn btn-outline-success fw-bold px-4"
                        >
                            Save Fees Structure
                        </button>

                    </div>

                </form>

            </div>

        </div>

    </AdminNavbar>
</template>






<script setup>

import AdminNavbar from '../../components/AdminNavbar.vue';
import {ref,onMounted} from 'vue';
import API from '../../services/api.js';
import router from '../../router/index.js';

const academicYears = ref([]);
const selectedAcademicYear = ref(null);

const getAcademicYears = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get('/api/academicyears',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        academicYears.value = res.data;

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
        });
        standards.value = res.data
    }catch(err){
        console.log(err.response.data.error);
    }
}

onMounted(getStandards);

const feesTypes = [
    "Tuition Fees","Exam Fees",
    "Books Fees","Uniform Fees",
    
];

const selectedFeeType = ref(null);

const amount = ref("");
const dueDate = ref("");

const errors = ref({});

const createFeeStructure = async()=>{

     errors.value = {};

if (!selectedAcademicYear.value) {
    errors.value.academicYear = "Please select Academic Year";
}

if (!selectedStandard.value) {
    errors.value.standard = "Please select Standard";
}

if (!selectedFeeType.value) {
    errors.value.feeType = "Please select Fee Type";
}

if (!amount.value || amount.value <=0) {
    errors.value.amount = "Please enter valid Amount";
}


if (Object.keys(errors.value).length > 0) {
    return;
}
    try{
        const token = localStorage.getItem("token");
        const data ={
            academicYearId : selectedAcademicYear.value.id,
            standardId:selectedStandard.value.id,
            feeType:selectedFeeType.value,
            amount:amount.value,
            dueDate:dueDate.value || null
        }
        const res = await API.post("/api/feestructures",data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data.message)
        router.push('/fees-structure/list')
    }catch(err){
        alert(err.response.data.error);
    }
}

</script>

<style >

.fee-form-card {
    max-width: 900px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-label {
    margin-bottom: 8px;
}

.form-control,
.input-group-text,
.dropdown-toggle {
    min-height: 44px;
}

.dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
}

</style>
