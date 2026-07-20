<template>

<div class="card shadow-sm rounded bg-white m-5 p-3">
<div class="card-body">
<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
<h3 class="fs-5 fw-bold">Recent Payments</h3>
<button class="btn btn-outline-primary">View All</button>
</div>


<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
<div class="input-group border-secondary rounded py-2 px-3 w-auto">
<i class='bi bi-search pe-2 input-group-text bg-white'></i>
<input type="search" placeholder="Search" class="form-control shadow-none">
</div>


<select class="form-select w-auto shadow-none">
<option>Today</option>
<option>Last Week</option>
<option>Last Month</option>
<option>All</option>

</select>
</div>


<div class="table-responsive">
<table class="table table-hover text-center">
<thead >
<tr class="table-light">
<th>Receipt No</th>
<th>Register No</th>
<th>Student Name</th>
<th>Class</th>
<th>Fee Type</th>
<th>Amount</th>
<th>Date</th>
<th>Status</th>
</tr>
</thead>

<tbody>
<tr>
<td>Rc1001</td>
<td>101001</td>
<td>Kavitha</td>
<td>10-A</td>
<td>Term 1</td>
<td>15000</td>
<td>20/07/2026</td>

<td >
<span class="badge bg-success p-2">Paid</span></td>
</tr>


<tr>
<td>Rc1002</td>
<td>101002</td>
<td>Manisha</td>
<td>10-A</td>
<td>Term 1</td>
<td>15000</td>
<td>20/07/2026</td>
<td >
<span class="badge bg-success p-2">Paid</span></td>

</tr>


<tr>
<td>Rc1003</td>
<td>110101</td>
<td>Nisha</td>
<td>LKG-A</td>
<td>Term 1</td>
<td>5000</td>
<td>20/07/2026</td>

<td >
<span class="badge bg-success p-2">Paid</span></td>

</tr>
</tbody>
</table>

</div>
</div>



</div>
</template>

<script setup>


</script>


<style scoped>
/* input:focus{
    outline:none;
} */

/* input{
    border:none;
} */
</style>