<template>
<AdminNavbar>
    <div class="container-fluid px-5">
        <h1 class="fs-4 text-success fw-bold mb-4 d-flex justify-content-center align-items-center">
    <i class="bi bi-cash-coin me-2 mt-2"></i>
    <span >Collect Fees</span>
</h1>

      <div class="row g-4 align-items-center">
        <div class="col-md-6">
            <div class="card shadow border-0 rounded-4">
                <div class="card-body p-4">
                    <h5 class="fw-bold text-success mb-3">
                        <i class="bi bi-search me-2"></i>
                        Find Student
                    </h5>

                    <label class="form-label fw-semibold">
                        Register No
                    </label>

                    <div class="input-group mt-2">

                        <input type="text" class="form-control" v-model="regNo" required
                            placeholder="Enter Register Number">

                        <button type="button" class="btn  btn-success" @click="searchStudent">Search</button>
                    </div>
                </div>
            </div>
        
        </div>

<div class="col-md-6">
    <div class="card shadow border-0 rounded-4">
        <div class="card-body p-4">

            <h5 class="fw-bold mb-3 text-success">
                <i class="bi bi-person-vcard me-2"></i>
                Student Details
            </h5>

            <div class="row">
                <div class="col-sm-6 mb-3">
                    <p class="text-muted mb-1">Name</p>
                    <p class="fw-semibold mb-0">{{ student?  student.user.name : '-' }}</p>
                </div>

                <div class="col-sm-6 mb-3">
                    <p class="text-muted mb-1">Register No</p>
                    <p class="fw-semibold mb-0">{{ student? student.regNo :"-" }}</p>
                </div>

                <div class="col-sm-6">
                    <p class="text-muted mb-1">Class</p>
                    <p class="fw-semibold mb-0">
                    {{ student? `${student.class.standard.name} - ${student.class.name}` :"-"}} 
                    </p>
                </div>

                <div class="col-sm-6">
                    <p class="text-muted mb-1">Phone</p>
                    <p class="fw-semibold mb-0">
                    {{ student?student.phone:"-" }}
                    </p>
                </div>
            </div>

        </div>
    </div>
</div>

    <div v-if="studentFees && studentFees.fees" class="card shadow border-0 rounded-4 mt-4">
    <div class="card-body p-4">
        <h5 class="fw-bold text-success mb-4"> <i class="bi bi-receipt me-2"></i>
            Fee Details</h5>
            
            <div class="table-responsive">
                <table class="table table-hover align-middle text-center">
                    <thead>
                        <tr>
                            <th>Fee Type</th>
                            <th>Total Amount</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="fee in studentFees.fees" :key="fee.feeId">
                            <td>{{ fee.feeType }}</td>
                            <td>₹{{Number(fee.totalAmount).toLocaleString("en-IN")  }}</td>
                            <td>₹{{ Number(fee.totalPaid).toLocaleString("en-IN") }}</td>
                            <td>₹{{ Number(fee.balance).toLocaleString("en-IN") }}</td>
                            <td>
                                {{ fee.dueDate ? new Date(fee.dueDate).toLocaleDateString("en-GB") : "-" }}
                            </td>
                            <td>
                            <button
                                v-if="fee.balance > 0"
                                class="btn btn-sm btn-success"
                            >
                                Collect
                            </button>

                            <span
                                v-else
                                class="badge bg-success-subtle text-success"
                            >
                                Paid
                            </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    </div>
    </div>
      </div>
    </div>

</AdminNavbar>
    </template>


    <script setup>
    import AdminNavbar from '../../components/AdminNavbar.vue';
    import { useRouter } from 'vue-router';
    import {ref,onMounted} from 'vue';
import API from '../../services/api.js';


    const router = useRouter();

    const regNo = ref("");
    const student = ref(null)

    const searchStudent = async()=>{
         if (!regNo.value.trim()) {
        alert("Please enter Register Number");
        return;
    }
        try{
            
            const token = localStorage.getItem("token");

            const res = await API.get(`/api/students/regno/${regNo.value}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            student.value = res.data;
            await getStudentFees();
           
        }catch(err){
            alert(err.response.data.error);
        }
    }

    const academicYear = ref(null);

    const getActiveAcademicYear = async()=>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get("/api/academicyears",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            academicYear.value = res.data.find(
                year => year.isActive
            )
        }catch(err){
            console.log(err.response.data.error)
        }
    }

    onMounted(getActiveAcademicYear);

    const studentFees = ref([])
    const getStudentFees = async()=>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get(`/api/students/${student.value.id}/fees/${academicYear.value.id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            studentFees.value = res.data;
            console.log(studentFees.value.fees)

        }catch(err){
            console.log(err.response.data.error);
        }
    }

    </script>

    <style scoped>
  
    </style>