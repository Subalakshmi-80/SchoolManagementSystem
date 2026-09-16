<template>
<AdminNavbar>
<div class="container-fluid px-4 py-3">

    <h1 class="fs-4 text-success text-center fw-bold mb-4">
        Edit Fees Structure
    </h1>

    <div class="fee-form-card   mx-auto">

        <form @submit.prevent="updateFeeStructure">

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
                                v-for="feeType in feeTypes"
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
                </div>

              
                <div class="col-md-6">
                    <label class="form-label fw-semibold">
                        Amount
                    </label>

                    <input
                        type="number"
                        class="form-control"
                        placeholder="Enter amount"
                        v-model="amount"
                    >

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
                        class="form-control"
                        v-model="dueDate"
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
                    Update Fees Structure
                </button>

            </div>

        </form>

    </div>

</div>

</AdminNavbar>
</template>

<script setup>
import AdminNavbar from '../../components/AdminNavbar.vue';
import { useRoute ,useRouter} from 'vue-router';
import {ref,onMounted} from 'vue';
import API from '../../services/api.js';

const route = useRoute();
const router = useRouter();

const feesId = route.params.id;

const feeStructure = ref(null);

const academicYears = ref([]);
const selectedAcademicYear = ref(null);

const standards = ref([]);
const selectedStandard = ref(null);

const feeTypes = [
    "Tuition Fees",
    "Exam Fees",
    "Books Fees",
    "Uniform Fees"
];

const selectedFeeType = ref(null);
const amount = ref("");
const dueDate = ref("")

const getFeeStructure = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get(`/api/feestructures/${feesId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        feeStructure.value = res.data;
        selectedAcademicYear.value = feeStructure.value.academicYear;
        selectedStandard.value = feeStructure.value.standard;
        selectedFeeType.value = feeStructure.value.feeType;
        amount.value = feeStructure.value.amount;
        dueDate.value = feeStructure.value.dueDate
            ? feeStructure.value.dueDate.split("T")[0]
            : "";

            
    }catch(err){
        console.log(err);
        alert(err.response.data.error)
    }
}

onMounted(getFeeStructure);

const getAcademicYears = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/academicyears",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        academicYears.value = res.data;
    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getAcademicYears);

const getStandards = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/standards",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        standards.value = res.data
    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getStandards);

const errors = ref({});
const updateFeeStructure = async()=>{


    errors.value = {};

    if (!amount.value || Number(amount.value) <= 0) {
        errors.value.amount = "Please enter a valid amount";
        return;
    }
    const feesId = route.params.id;

    try{
        const token = localStorage.getItem("token");

        const data = {
            academicYearId:selectedAcademicYear.value.id,
            standardId : selectedStandard.value.id,
            feeType : selectedFeeType.value,
            amount:amount.value,
            dueDate:dueDate.value || null
        }

        const res = await API.put(`/api/feestructures/${feesId}`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        alert(res.data.message);
        router.push('/fees-structure/list')

    }catch(err){
        alert(err.response.data.error)
    }
}
</script>