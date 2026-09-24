
<template>
    <AdminNavbar>
        <div>

            <h1 class="fs-4 text-success text-center">
                Add Holiday
            </h1>

            <div class="d-flex justify-content-center mt-4">

                <div class="card shadow-sm p-4" style="width: 650px;">

                    <form @submit.prevent="createHoliday">

                        <div class="row">

                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">
                                    From Date <span class="text-danger">*</span>
                                </label>

                                <input
                                    type="date"
                                    class="form-control"
                                    required
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
                                    required
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
                                required
                                v-model="holiday.reason"
                            >
                        </div>

                        <div class="d-flex justify-content-center align-items-center gap-3 mt-4">

                            <button
                                class="btn btn-outline-success"
                                type="submit"
                            >
                                Add Holiday
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
import AdminNavbar from '../../components/AdminNavbar.vue';
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import API from '../../services/api.js';

const router = useRouter();

const holiday = ref({
    from_date: "",
    to_date: "",
    reason: "",
    academicYearId:null
});


const getActiveAcademicYear = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await API.get("/api/academicyears", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const activeYear = res.data.find(
            year => year.isActive
        );

        if (activeYear) {
            holiday.value.academicYearId = activeYear.id;
        }

    } catch (err) {
        console.log(err.response?.data?.error);
    }
};

onMounted(getActiveAcademicYear);


const createHoliday = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await API.post(
            "/api/calendar/holiday",
            holiday.value,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(res.data.message);

        router.push("/school-calendar/list");

    } catch (err) {
console.log(err)
        alert(
            err.response?.data?.error ||
            "Something went wrong. Please try again later."
        );


    }
};


</script>

