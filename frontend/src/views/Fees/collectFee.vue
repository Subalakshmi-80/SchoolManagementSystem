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
                                @click="selectedFee = fee"
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

            <div v-if="selectedFee" class="card shadow border-0 rounded-4 mt-4">
                <div class="card-body p-4">
                    <h5 class="fw-bold text-success mb-4">
                        <i class="bi bi-cash-stack me-2"></i>
                        Collect Payment
                    </h5>

                    <div class="row g-3 align-items-center">
                    
                        <div class="col-md-4">
                            <label class="form-label text-muted">
                                Fees Type
                            </label>

                            <div class="fw-semibold">{{ selectedFee.feeType }}</div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-muted">
                                Balance
                            </label>

                            <div class="fw-semibold">₹{{ Number(selectedFee.balance).toLocaleString("en-IN") }}</div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-muted">
                                Amount
                            </label>

                            <input type="number" class="form-control" required
                            v-model="paymentAmount"
                            :max="selectedFee.balance"
                            placeholder="Enter amount">
                        </div>

                        <div class="col-md-12">
                            <label class="form-label fw-semibold">
                                Remarks
                            </label>

                            <textarea
                                class="form-control"
                                v-model="remarks"
                                rows="2"
                                placeholder="Enter remarks (optional)"
                            ></textarea>
                        </div>                       
                    </div>


                    <div class="d-flex justify-content-end gap-2 mt-4">
                        <button type="button"
                        class="btn btn-outline-secondary"
                        @click="selectedFee=null;paymentAmount=''"
                        >Cancel</button>

                        <button class="btn btn-success" type="button"
                        @click="collectPayment">Collect Payment</button>
                    </div>
                    
                </div>
            
            </div>

            <div v-if="paymentReceipt" class="receipt-wrapper mt-4">

                <div class="receipt" id="paymentReceipt">

                <button
        type="button"
        class="receipt-close no-print"
        @click="paymentReceipt = null"
    >
        ×
    </button>
                    <div class="text-center mb-3">
                        <h5 class="fw-bold mb-1">Oxford Public School</h5>
                        <small class="text-muted">Fees Receipt</small>
                    </div>

                    <div class="receipt-line"></div>

                    <div class="d-flex justify-content-between mb-2">
                        <span>Receipt No</span>
                        <strong>{{ paymentReceipt.receiptNo }}</strong>
                    </div>

                    <div class="d-flex justify-content-between mb-3">
                        <span>Date</span>
                        <strong>{{new Date(paymentReceipt.paymentDate).toLocaleDateString("en-GB")}}</strong>
                    </div>

                    <div class="receipt-line"></div>

                    <div class="row g-2 mt-2">
                        <div class="col-6">
                            <small class="text-muted">Student Name</small>
                            <div class="fw-semibold">{{ paymentReceipt.studentName }}</div>
                        </div>

                        <div class="col-6">
                            <small class="text-muted">Register No</small>
                            <div class="fw-semibold">{{ paymentReceipt.regNo }}</div>
                        </div>

                        <div class="col-6">
                            <small class="text-muted">Class</small>
                            <div class="fw-semibold">{{ paymentReceipt.className }}</div>
                        </div>

                        <div class="col-6">
                            <small class="text-muted">Fee Type</small>
                            <div class="fw-semibold">{{ paymentReceipt.feeType }}</div>
                        </div>
                    </div>
                      <div class="receipt-line my-3"></div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Total Fees</span>
                    <strong class="text-success"> ₹{{ Number(paymentReceipt.totalFees).toLocaleString("en-IN") }}</strong>
               </div>

               <div class="d-flex justify-content-between mb-2">
                    <span>Amount Paid</span>
                    <strong class="text-success"> ₹{{ Number(paymentReceipt.paidAmount).toLocaleString("en-IN") }}</strong>
               </div>

               <div class="d-flex justify-content-between mb-2">
                    <span>Balance</span>
                    <strong class="text-success"> ₹{{ Number(paymentReceipt.balance ).toLocaleString("en-IN") }}</strong>
               </div>

               <div v-if="paymentReceipt.remarks" class="mt-3">
                <small class="text-muted">Remarks</small>
                <div>{{ paymentReceipt.remarks }}</div>
               </div>

                <div class="receipt-line my-3"></div>

                <div class="text-center mt-4">
                    <small class="text-muted">Authorized Signature</small>
                </div>

                
            </div>

            
                </div>

                  <div class="text-center mt-3 no-print" v-if="paymentReceipt">
        <button
            type="button"
            class="btn btn-success"
            @click="printReceipt"
        >
            <i class="bi bi-printer me-1"></i>
            Print Receipt
        </button>
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

    const studentFees = ref(null);

    const selectedFee = ref(null);
    const paymentAmount = ref("");
    const remarks = ref("");

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

const paymentReceipt = ref(null);
const collectPayment = async()=>{
    if(!paymentAmount.value){
        alert("Please enter payment amount.");
        return;
    }

    if(Number(paymentAmount.value) <= 0){
        alert("Payment amount must be greater than 0");
        return;
    }

    if(Number(paymentAmount.value) > Number(selectedFee.value.balance)){
        alert("Payment amount cannot be greater than balance");
        return;
    }

    try{
        const token = localStorage.getItem("token");

        const res = await API.post('/api/feepayments',{
            studentId:student.value.id,
            feeStructureId : selectedFee.value.feeId,
            amountPaid:Number(paymentAmount.value),
            paymentDate : new Date(),
            remarks:remarks.value || null
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        const payment = res.data.data;

        paymentReceipt.value={
            ...payment,
            studentName : student.value.user.name,
            regNo:student.value.regNo,
            className:`${student.value.class.standard.name} - ${student.value.class.name}`,
            feeType:selectedFee.value.feeType,
            totalFees:selectedFee.value.totalAmount,
            paidAmount:paymentAmount.value,
            balance:Number(selectedFee.value.balance)-Number(paymentAmount.value)
        }
        
        selectedFee.value=null;
        paymentAmount.value="";
        remarks.value=""

        await getStudentFees();
    }catch(err){
        alert(err.response.data.error);
    }
}


const printReceipt = () => {

    const receipt = paymentReceipt.value;

    const printWindow = window.open("", "_blank", "width=500,height=700");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Fees Receipt</title>

            <style>

                @page {
                    size: A5 portrait;
                    margin: 8mm;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    color: #222;
                    background: #f5f5f5;
                }

                .receipt {
                    position: relative;
                    width: 132mm;
                    margin: 20px auto;
                    padding: 8mm;
                    background: white;
                    border: 1px solid #ccc;
                }

                .close-btn {
                    position: absolute;
                    top: 8px;
                    right: 10px;
                    width: 26px;
                    height: 26px;
                    border: none;
                    border-radius: 50%;
                    background: #dc3545;
                    color: white;
                    font-size: 18px;
                    line-height: 26px;
                    cursor: pointer;
                }

                .close-btn:hover {
                    background: #bb2d3b;
                }

                .center {
                    text-align: center;
                }

                .school-name {
                    font-size: 17px;
                    font-weight: bold;
                    margin-bottom: 3px;
                }

                .title {
                    font-size: 12px;
                    color: #666;
                }

                .line {
                    border-top: 1px dashed #999;
                    margin: 7px 0;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }

                .label {
                    color: #666;
                }

                .value {
                    font-weight: bold;
                }

                .student-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px 15px;
                    margin-top: 7px;
                }

                .student-label {
                    color: #666;
                    font-size: 10px;
                }

                .student-value {
                    font-weight: bold;
                    margin-top: 2px;
                }

                .amount {
                    font-weight: bold;
                }

                .green {
                    color: #198754;
                }

                .remarks {
                    margin-top: 7px;
                }

                .signature {
                    text-align: center;
                    margin-top: 18px;
                    color: #666;
                }

                @media print {

                    body {
                        background: white;
                    }

                    .receipt {
                        margin: 0 auto;
                        border: 1px solid #ccc;
                    }

                    .close-btn {
                        display: none;
                    }

                }

            </style>

        </head>

        <body>

            <div class="receipt">

                

                <div class="center">

                    <div class="school-name">
                        Oxford Public School
                    </div>

                    <div class="title">
                        Fees Receipt
                    </div>

                </div>

                <div class="line"></div>

                <div class="row">
                    <span class="label">Receipt No</span>
                    <span class="value">${receipt.receiptNo}</span>
                </div>

                <div class="row">
                    <span class="label">Date</span>
                    <span class="value">
                        ${new Date(receipt.paymentDate).toLocaleDateString("en-GB")}
                    </span>
                </div>

                <div class="line"></div>

                <div class="student-grid">

                    <div>
                        <div class="student-label">Student Name</div>
                        <div class="student-value">
                            ${receipt.studentName}
                        </div>
                    </div>

                    <div>
                        <div class="student-label">Register No</div>
                        <div class="student-value">
                            ${receipt.regNo}
                        </div>
                    </div>

                    <div>
                        <div class="student-label">Class</div>
                        <div class="student-value">
                            ${receipt.className}
                        </div>
                    </div>

                    <div>
                        <div class="student-label">Fee Type</div>
                        <div class="student-value">
                            ${receipt.feeType}
                        </div>
                    </div>

                </div>

                <div class="line"></div>

                <div class="row">
                    <span>Total Fees</span>

                    <span class="amount green">
                        ₹${Number(receipt.totalFees).toLocaleString("en-IN")}
                    </span>
                </div>

                <div class="row">
                    <span>Amount Paid</span>

                    <span class="amount green">
                        ₹${Number(receipt.paidAmount).toLocaleString("en-IN")}
                    </span>
                </div>

                <div class="row">
                    <span>Balance</span>

                    <span class="amount green">
                        ₹${Number(receipt.balance).toLocaleString("en-IN")}
                    </span>
                </div>

                ${
                    receipt.remarks
                    ? `
                        <div class="remarks">

                            <div class="label">
                                Remarks
                            </div>

                            <div>
                                ${receipt.remarks}
                            </div>

                        </div>
                    `
                    : ""
                }

                <div class="line"></div>

                <div class="signature">
                    Authorized Signature
                </div>

            </div>

        </body>

        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.onload = () => {
        printWindow.print();
    };

};


    </script>

<style>
.receipt-wrapper {
    display: flex;
    justify-content: center;
}

.receipt {
    width: 420px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 24px;
}

.receipt-line {
    border-top: 1px dashed #999;
}

.receipt {
    position: relative;
    width: 420px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 24px;
}

.receipt-close {
    position: absolute;
    top: 8px;
    right: 10px;
    border: none;
    background: transparent;
    color: #777;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
}

.receipt-close:hover {
    color: #dc3545;
}

</style>