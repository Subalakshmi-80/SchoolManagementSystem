<template>
    <AdminNavbar>
        <div>
            <h1 class="fs-4 text-success text-center">Edit Academic Year</h1>

            <div class="d-flex justify-content-center mt-4">
                <div class="card shadow-sm p-4" style="width: 650px;">
                    <form @submit.prevent="editAcademicYear">

                        <div class="mb-3">
                            <label class="form-label fw-bold">
                                Academic Year <span class="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                class="form-control"
                                v-model="academicYear.name"
                                readonly
                                required
                            >
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">
                                    Start Date <span class="text-danger">*</span>
                                </label>

                                <input
                                    type="date"
                                    class="form-control"
                                    v-model="academicYear.startDate"
                                    @change="updateAcademicYear"
                                    required
                                >
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">
                                    End Date <span class="text-danger">*</span>
                                </label>

                                <input
                                    type="date"
                                    class="form-control"
                                    v-model="academicYear.endDate"
                                    :min="academicYear.startDate"
                                    required
                                >
                            </div>
                        </div>

                        <div class="form-check mb-3">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="isActive"
                                v-model="academicYear.isActive"
                            >

                            <label
                                class="form-check-label fw-bold"
                                for="isActive"
                            >
                                Active
                            </label>
                        </div>

                        <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
                            <button
                                class="btn btn-outline-success"
                                type="submit"
                            >
                                Update Academic Year
                            </button>

                            <button
                                class="btn btn-outline-secondary"
                                type="button"
                                @click="router.push('/academic-year/list')"
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import API from '../../services/api';

const router = useRouter();
const route = useRoute();

const academicYear = ref({
    name: "",
    startDate: "",
    endDate: "",
    isActive: false
});

const getAcademicYear = async () => {
    const id = route.params.id;

    try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/api/academicyears/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        academicYear.value = {
            ...res.data,
            startDate: res.data.startDate.slice(0, 10),
            endDate: res.data.endDate.slice(0, 10)
        };

    } catch (err) {
        console.log("Error fetching academic year", err.response);

        alert(
            err.response?.data?.error ||
            "Something went wrong. Please try again later."
        );
    }
};

onMounted(getAcademicYear);

const updateAcademicYear = () => {
    if (!academicYear.value.startDate) {
        academicYear.value.name = "";
        academicYear.value.endDate = "";
        return;
    }

    const date = new Date(academicYear.value.startDate);
    const year = date.getFullYear();

    academicYear.value.name = `${year}-${year + 1}`;

    // Start date changed, so select end date again
    academicYear.value.endDate = "";
};

const editAcademicYear = async () => {
    const id = route.params.id;

    try {
        const token = localStorage.getItem("token");

        const res = await API.put(
            `/api/academicyears/${id}`,
            academicYear.value,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(res.data.message);

        router.push('/academic-year/list');

    } catch (err) {
        alert(
            err.response?.data?.error ||
            "Something went wrong. Please try again later."
        );

        console.log(err.response);
    }
};
</script>