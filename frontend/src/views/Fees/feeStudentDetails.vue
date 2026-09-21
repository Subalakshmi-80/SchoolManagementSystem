<template>

    <AdminNavbar>

        <div class="container-fluid px-5">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="fs-4 text-success fw-bold">
                    Student Fees Details
                </h1>

                <button
                    class="btn btn-outline-secondary"
                    @click="router.back()"
                >
                    Back
                </button>
            </div>

            <div v-if="student">

                <div class="card border-0 shadow-sm mb-4">
    <div class="card-body">
        <div class="row align-items-center">

            <div class="col-md-4">
                <h2 class="fs-5 fw-bold mb-1">
                    {{ student.user.name }}
                </h2>
                <small class="text-muted">Student</small>
            </div>

            <div class="col-md-4">
                <small class="text-muted d-block">Registration No</small>
                <span class="fw-semibold">
                    {{ student.regNo }}
                </span>
            </div>

            <div class="col-md-4">
                <small class="text-muted d-block">Class</small>
                <span class="fw-semibold">
                    {{ student.class.standard.name }} - {{ student.class.name }}
                </span>
            </div>

        </div>
    </div>
</div>
                <div class="table-responsive mt-4">

                    <table class="table table-bordered text-center align-middle">

                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Fee Type</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="(fee,index) in student.fees"
                                :key="fee.feeId"
                            >
                                <td>{{ index + 1 }}</td>
                                <td>{{ fee.feeType }}</td>
                                <td>₹{{ fee.totalAmount }}</td>
                                <td>₹{{ fee.totalPaid }}</td>
                                <td>₹{{ fee.balance }}</td>
                                <td>
                                    <span v-if="fee.status === 'Paid'" class="badge bg-success">Paid</span>
                                    <span v-if="fee.status === 'Partial'" class="badge bg-warning">Partial</span>
                                    <span v-if="fee.status === 'Pending'" class="badge bg-danger">Pending</span>
                                
                                </td>
                                <td>{{ formatDate(fee.dueDate) }}</td>
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
import { useRouter,useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import API from '../../services/api.js';

const router = useRouter();
const route = useRoute();

const studentId = route.params.studentId;
const academicYearId = route.query.academicYearId
const student = ref(null);

const getStudentFees = async()=>{
    try{
        const token = localStorage.getItem("token");
         const res = await API.get(`/api/students/${studentId}/fees/${academicYearId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }

         })
          student.value = {
            ...res.data.student,
            fees: res.data.fees
        };
       
    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(getStudentFees);

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};
</script>