
<template>

    <AdminNavbar>

        <div>

            <h1 class="fs-4 text-success text-center">
                Edit Holiday
            </h1>

            <div class="d-flex justify-content-center mt-4">

                <div class="card shadow-sm p-4" style="width: 650px;">

                    <form @submit.prevent="updateHoliday">

                        <div class="row">

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-bold">
                                    From Date <span class="text-danger">*</span>
                                </label>

                                <input
                                    type="date"
                                    class="form-control"
                                    v-model="holiday.from_date"
                                >

                            </div>

                            <div class="col-md-6 mb-3">

                                <label class="form-label fw-bold">
                                    To Date <span class="text-danger">*</span>
                                </label>

                                <input
                                    type="date"
                                    class="form-control"
                                    v-model="holiday.to_date"
                                    :min="holiday.from_date"
                                >

                            </div>

                        </div>

                        <div class="mb-3">

                            <label class="form-label fw-bold">
                                Reason <span class="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                class="form-control"
                                placeholder="Enter holiday reason"
                                v-model="holiday.reason"
                            >

                        </div>

                        <div class="d-flex justify-content-center align-items-center gap-3 mt-4">

                            <button
                                class="btn btn-outline-success"
                                type="submit"
                            >
                                Update Holiday
                            </button>

                            <button
                                class="btn btn-outline-secondary"
                                type="button"
                                @click="router.push('/school-calendar/list')"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    </AdminNavbar>

</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminNavbar from '../../components/AdminNavbar.vue';
import API from '../../services/api.js';

const route = useRoute();
const router = useRouter();

const holiday = ref({
    from_date: "",
    to_date: "",
    reason: ""
});

const getHoliday = async () => {

    try {

        const token = localStorage.getItem("token");

        const groupId = route.params.groupId;

        const res = await API.get(
            `/api/calendar/holiday/${groupId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
            holiday.value = {
                from_date: res.data.holiday.from_date.substring(0, 10),
                to_date: res.data.holiday.to_date.substring(0, 10),
                reason: res.data.holiday.reason
            };



    } catch (err) {

        console.log(err.response?.data?.error);

    }

};

onMounted(getHoliday);

const updateHoliday = async () => {

    try {

        const token = localStorage.getItem("token");

        const groupId = route.params.groupId;

        const res = await API.put(
            `/api/calendar/holiday/${groupId}`,
            {
                from_date: holiday.value.from_date,
                to_date: holiday.value.to_date,
                reason: holiday.value.reason
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(res.data.message);

        router.push("/school-calendar/list");

    } catch (err) {

        alert(
            err.response?.data?.error ||
            "Something went wrong. Please try again later."
        );

    }

};



</script>

