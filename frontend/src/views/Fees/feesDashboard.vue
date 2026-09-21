<template>
<AdminNavbar>
    <div class="container-fluid px-5 ">
        <div class="d-flex justify-content-between align-items-center">
    
        <h1 class="fs-4 text-success text-center fw-bold mb-4">Fees Dashboard</h1>
        <button class="btn btn-success fw-bold" @click="router.push('/fees/collect')">+ Collect Fees</button>
        </div>

        <div>
        <div class="dropdown mb-4">
            <button
                class="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
            >
                {{ selectedAcademicYear ? selectedAcademicYear.name : "Academic Year" }}
            </button>

            <ul class="dropdown-menu">
                <li v-for="academicYear in academicYears" :key="academicYear.id">
                    <button
                        class="dropdown-item"
                        type="button"
                        @click="selectAcademicYear(academicYear)"
                    >
                        {{ academicYear.name }}
                    </button>
                </li>
            </ul>
            </div>
        </div>
        <div class="row g-4 mb-4">
            <div class="col-md-6 col-xl-3">
                <div class="card shadow border-0">
                    <div class="card-body">
                        <p class="text-muted mb-1">Total Fees</p>
                        <h3 class="fw-bold mb-0"><i class="bi bi-currency-rupee"></i>
                            {{ (feeDashboardData?.summary?.totalFee || 0 ).toLocaleString("en-IN")}}
                        </h3>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="card shadow border-0">
                    <div class="card-body">
                        <p class="text-muted mb-1">Today's Received</p>
                        <h3 class="fw-bold mb-0"><i class="bi bi-currency-rupee"></i>
                            {{ (feeDashboardData?.summary?.todayReceived || 0 ).toLocaleString("en-IN")}}
                        </h3>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="card shadow border-0">
                    <div class="card-body">
                        <p class="text-muted mb-1">Total Paid</p>
                        <h3 class="fw-bold mb-0"><i class="bi bi-currency-rupee"></i>
                            {{ (feeDashboardData?.summary?.totalPaid || 0).toLocaleString("en-IN") }}
                        </h3>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="card shadow border-0">
                    <div class="card-body">
                        <p class="text-muted mb-1">Total Pending</p>
                        <h3 class="fw-bold mb-0"><i class="bi bi-currency-rupee"></i>
                            {{ (feeDashboardData?.summary?.totalPending || 0).toLocaleString("en-IN") }}
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4">

            <div class="d-flex  align-items-center gap-5">
                <h2 class="fs-5 fw-bold text-success mb-4">Class-wise Fees Status</h2>

                <div  class="dropdown mb-4">
                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {{ selectedClass ? `${selectedClass.standard.name} - ${selectedClass.name}` : "All Classes" }}
                    </button>

                     <ul class="dropdown-menu">

                        <li>
                            <button class="dropdown-item"
                            type="button" @click="selectedClass=null"
                            >All Classes</button>
                        </li>
                        <li v-for="cls in classes" :key="cls.id">
                    <button
                        class="dropdown-item"
                        type="button"
                        @click="selectedClass = cls"
                    >
                       {{ cls.standard.name }} - {{ cls.name }}
                    </button>
                </li>
            </ul>
                
                </div>
            </div>
            

            <div class="table-responsive">
                <table class="table table-hover text-center align-middle">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Total Students</th>
                            <th>Paid</th>
                            <th>Partial</th>
                            <th>Pending</th>
                            <th>Action</th>
                        </tr>
                    </thead>


                    <tbody>
                        <tr v-for="cls in filteredClasses" :key="cls.classId">
                            <td>{{ cls.standard }}-{{ cls.className }}</td>
                            <td>{{ cls.totalStudents }}</td>
                            <td>{{ cls.paid }}</td>
                            <td>{{ cls.partial }}</td>
                            <td>{{ cls.pending }}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-success" @click="router.push(`/fees/class/${cls.classId}?academicYearId=${selectedAcademicYear.id}`)">
                                    View Details
                                </button>
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
import {ref,onMounted, computed} from 'vue';
import API from '../../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const classes = ref([]);
const selectedClass = ref(null)
const getClasses =async()=>{
    try{
        const token = localStorage.getItem("token");
        const res = await API.get('/api/classes',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value = res.data;
        console.log(classes.value);
    }catch(err){
        console.log(err.response.data.error)
    }
}

onMounted(getClasses);

const academicYears = ref([]);
const selectedAcademicYear = ref(null);

const getAcademicYears = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get('/api/academicyears',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        academicYears.value = res.data;

        const activeYear = academicYears.value.find(
            year=>year.isActive
        )

        if(activeYear){
            selectedAcademicYear.value=activeYear
        }
    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getAcademicYears);

const feeDashboardData = ref(null);

const getFeeDashoard = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/feesdashboard",{
            params:{
                academicYearId: selectedAcademicYear.value?.id
            },
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        feeDashboardData.value = res.data
    }catch(err){
        console.log(err.response.data.error)
    }
}

onMounted(getFeeDashoard);

const selectAcademicYear = (academicYear)=>{
    selectedAcademicYear.value = academicYear;
    getFeeDashoard();
}
const filteredClasses = computed(()=>{
    const  dashboardClasses = feeDashboardData.value?.classes || [];

    if(!selectedClass.value){
        return dashboardClasses;
    }

    return dashboardClasses.filter(
        cls => cls.classId === selectedClass.value.id
    )
})

const students = ref([]);

const getStudents = async()=>{
    try{

        const token = localStorage.getItem("token");

        const res = await API.get("/api/students",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        students.value = res.data;
    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getStudents);

//count students by class

const getStudentCount = (classId)=>{
    return students.value.filter(
        student=> student.classId === classId
    ).length
}
</script>