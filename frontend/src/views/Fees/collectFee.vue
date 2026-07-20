<template>
<AdminNavbar>
<div class="m-5">
<div class="row align-items-center">
<div class="col-md-3">
<button class="btn btn-outline-secondary" @click="router.push('/feesDashboard')"><i class=" bi bi-arrow-left me-2"></i>Back</button>
</div>

<div class="col-md-9 text-center">


<h2 class="col-md-9">Collect Student Fee</h2>
</div>

</div>


<div class="card shadow-sm bg-white mt-4 p-3">

<h5 class="fs-4 fw-bold"><i class="bi bi-person me-2 text-primary fs-3"></i>Student Information</h5>
<hr class=" text-primary opacity-75">


<form >
<div class="row align-items-center">
<div class="col-md-6 mb-3">
<label class="for-label fw-semibold">Register Number <span class="text-danger">*</span></label>

<div class="input-group  border-secondary rounded  w-auto">
<input type="search" class="form-control shadow-none" placeholder="Search register number">
<span class="input-group-text bg-white"><i class="bi bi-search "></i></span>
</div>

</div>

<div class="col-md-6 mb-3">
<label class="for-label fw-semibold">Student Name</label>
<input type="text" class="form-control shadow-none" value="Kavitha" readonly>
</div>

<div class="col-md-6 mb-3">
<label class="for-label fw-semibold">Class</label>
<input type="text" class="form-control shadow-none" value="10-A" readonly>

</div>

<div class="col-md-6 mb-3">
<label class="for-label fw-semibold">Academic Year</label>
<input type="text" class="form-control shadow-none" value="2026-2027" readonly>

</div>

</div>




</form>

</div>


<div class="card shadow-sm bg-white mt-4 p-3">

<h5 class="fs-4 fw-bold"><i class="bi bi-file-earmark me-2 text-primary fs-3"></i>Fee Information</h5>
<hr class=" text-primary opacity-75">


<form>

<div class="row align-items-center">

<div class="col-md-6 mb-3">
<label class="form-label fw-semibold">Fee Type <span class="text-danger">*</span></label>
<select class="form-select shadow-none required">
<option value="" disabled>Select Fee Type</option>
<option>Term 1</option>
<option>Term 2</option>
<option>Term 3</option>
<option>Transport Fees</option>
<option>Hostel Fees</option>


</select>
</div>


<div class="col-md-6 mb-3">
<label class="form-label fw-semibold">Amount <span class="text-danger">*</span></label>
<input type="number" class="form-control shadow-none" placeholder="Enter amount" required>
</div>

<div class="col-md-6 mb-3">
<label class="form-label fw-semibold">Payment Date <span class="text-danger">*</span></label>
<input type="date" class="form-control shadow-none" v-model="paymentDate" required>
</div>

<div class="col-md-6 mb-3">
<label class="form-label fw-semibold">Remarks</label>
<textarea class="form-control" placeholder="Enter remarks (if any)"></textarea></div>
</div>

<div class="d-grid d-md-flex justify-content-md-end align-items-center gap-3">

<button class="btn btn-secondary opacity-75 fw-bold px-md-3 py-md-2" @click="router.push('/feesDashboard')">Cancel</button>
<button class="btn btn-primary fw-bold px-md-4 py-md-2">Collect Fee</button>
</div>
</form>
</div>

</div>


</AdminNavbar>
    </template>


    <script setup>
    import AdminNavbar from '../../components/AdminNavbar.vue';
    import { useRouter } from 'vue-router';
    import {ref} from 'vue';

    const today = new Date()

    console.log(today)

    const paymentDate = ref(today)
   
    const router = useRouter();
    </script>