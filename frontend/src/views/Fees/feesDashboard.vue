<template>
<AdminNavbar>
<div class="bg-light bg-opacity-25 vh-100">
<div class="d-flex justify-content-between align-items-center m-5">
<h1 class="fs-2 fw-bold">Fees Overview</h1>
<button class="btn btn-primary fw-bold py-md-2 px-md-4 rounded-4" @click="router.push('/fees/collect')">+ Collect Fee</button>
</div>

<SummaryFees/>
<RecentPayments/>

</div>

</AdminNavbar>
    </template>


    <script setup>
    import AdminNavbar from '../../components/AdminNavbar.vue';
import RecentPayments from '../../components/Fees/RecentPayments.vue';
import SummaryFees from '../../components/Fees/SummaryFees.vue';

import { useRouter } from 'vue-router';

const router = useRouter();
    
    </script>