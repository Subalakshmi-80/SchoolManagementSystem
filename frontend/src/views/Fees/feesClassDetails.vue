<template>

<AdminNavbar>
  <div class="container-fluid px-5">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="fs-4 text-success fw-bold">
                    Fees Details
                </h1>

                <button
                    class="btn btn-outline-secondary"
                    @click="router.back()"
                >
                    Back
                </button>
            </div>

            <h2 v-if="classes" class="fs-5 fw-bold">
                Class: {{ classes.standard.name }} - {{ classes.name }}
            </h2>

            <div class="row mt-4 mb-3">
            <div class="col-md-3">
                <label class="form-label fw-bold">Fee Type</label>

                <select v-model="selectedFeeType" class="form-select">
                <option value="">All Fee Types</option>
                <option value="Tuition Fees">Tuition Fees</option>
                <option value="Exam Fees">Exam Fees</option>
                <option value="Books Fees">Books Fees</option>
                <option value="Uniform Fees">Uniform Fees</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label fw-bold">Status</label>

                <select v-model="selectedStatus" class="form-select">
                    <option value="">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                </select>
                </div>
            </div>

            <div v-if="filteredStudents.length===0"class="text-danger fw-bold text-center">No students found for the selected filter.</div>
            <div v-else class="table-responsive mt-4">
                <table class="table table-hover text-center align-middle">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Reg No</th>
                            <th>Student Name</th>
                            <th v-if="!selectedFeeType || selectedFeeType === 'Tuition Fees'">
                            Tuition Fees
                            </th>

                            <th v-if="!selectedFeeType || selectedFeeType === 'Exam Fees'">
                            Exam Fees
                            </th>

                            <th v-if="!selectedFeeType || selectedFeeType === 'Books Fees'">
                            Books Fees
                            </th>

                            <th v-if="!selectedFeeType || selectedFeeType === 'Uniform Fees'">
                            Uniform Fees
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(student,index) in filteredStudents" :key="student.studentId">
                            <td>{{ index+1 }}</td>
                            <td>{{ student.regNo }}</td>
                            <td>{{ student.name }}</td>
                           <td v-if="!selectedFeeType || selectedFeeType === 'Tuition Fees'">
                            {{ getFeeStatus(student, 'Tuition Fees') }}
                            </td>

                            <td v-if="!selectedFeeType || selectedFeeType === 'Exam Fees'">
                            {{ getFeeStatus(student, 'Exam Fees') }}
                            </td>

                            <td v-if="!selectedFeeType || selectedFeeType === 'Books Fees'">
                            {{ getFeeStatus(student, 'Books Fees') }}
                            </td>

                            <td v-if="!selectedFeeType || selectedFeeType === 'Uniform Fees'">
                            {{ getFeeStatus(student, 'Uniform Fees') }}
                            </td>
                            
                            <td>
                                <button class="btn btn-sm btn-outline-success" @click="router.push(`/fees/student/${student.studentId}?academicYearId=${academicYearId}`)">
                                    View
                                </button>
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
import { useRoute,useRouter } from 'vue-router';
import {ref,onMounted,computed} from 'vue';
import API from '../../services/api.js';


const router = useRouter();
const route = useRoute();

const classId = route.params.classId;

const classes = ref(null)
const getClassDetails = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get(`/api/classes/${classId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value = res.data;
       
    }catch(err){
        console.log(err.response.data.error)
    }
}



const students = ref([]);

const academicYearId = route.query.academicYearId;

const getFeeStatus = (student,feeType) =>{
    const fee = student.fees.find(
        fee => fee.feeType === feeType
    )
    return fee?fee.status:"-"
}

const getClassStudentFees = async()=>{
    try{
        const token = localStorage.getItem("token");
         const res = await API.get(`/api/fees/class/${classId}/students?academicYearId=${academicYearId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
         })

         students.value = res.data;
         
    }catch(err){
        console.log(err.response.data.error);
    }
}

onMounted(()=>{
    getClassDetails(),
    getClassStudentFees()
})

const selectedFeeType = ref("");
const selectedStatus = ref("")
 
const filteredStudents = computed(() => {
   return students.value.filter(student =>{

    if(selectedFeeType.value){
        const fee = student.fees.find(
            fee => fee.feeType === selectedFeeType.value
        )

        if(!fee){
            return false
        }

        if(selectedStatus.value && fee.status !== selectedStatus.value){
            return false
        }
        return true;
    }

    if(!selectedFeeType.value && selectedStatus.value){
        return getOverallStatus(student) === selectedStatus.value;
        }

    
    return true;
   })
});

const getOverallStatus = (student) => {
    const statuses = student.fees.map(fee => fee.status);

    if (statuses.length === 0) {
        return "-";
    }

    if (statuses.every(status => status === "Paid")) {
        return "Paid";
    }

    if (statuses.some(status => status === "Pending")) {
        return "Pending";
    }

    return "Partial";
};
</script>