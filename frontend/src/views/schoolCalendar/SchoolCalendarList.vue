<template>

    <AdminNavbar>

            <div>

                <div class="d-flex justify-content-between align-items-center px-5 mt-3">

                    <h1 class="fs-4 text-success text-center">
                        School Calendar
                    </h1>

                    <button
                        class="btn btn-success fw-bold"
                        @click="router.push('/school-calendar/create')"
                    >
                        <i class="bi bi-plus-lg me-2"></i>
                        Add Holiday
                    </button>

                </div>

                <div class="d-flex align-items-center px-5 my-4 gap-3">

                    <div class="dropdown">

                     
                        <button
                            class="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                           
                        >
                            {{ selectedAcademicYear ? selectedAcademicYear.name : "All Academic Years" }}
                        </button>

                        <ul class="dropdown-menu">

                            <li class="dropdown-item" @click="selectedAcademicYear=null;getHolidays()">All Academic Years</li>
                           
                            <li v-for="academicYear in academicYears" :key="academicYear.id">
                                <button
                                    class="dropdown-item"
                                    type="button"
                                    @click="selectedAcademicYear = academicYear; getHolidays()"
                                >
                                    {{ academicYear.name }}
                                </button>
                            </li>




                        </ul>


                    </div>

                </div>

                <div class="px-5 mt-2">

                    <div
                        v-if="holidays.length === 0"
                        class="text-danger text-center fw-bold"
                    >
                        Holidays not found.
                    </div>

                    <table
                        v-else
                        class="table table-responsive table-hover"
                    >
                        <thead>
                            <tr class="text-center align-middle">
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr
                                v-for="holiday in holidays"
                                :key="holiday.groupId"
                                class="text-center align-middle"
                            >
                                <td>{{ formatDate(holiday.from_date) }}</td>

                                <td>{{ formatDate(holiday.to_date) }}</td>

                                <td>{{ holiday.reason }}</td>

                                <td>
                                    <div class="d-flex justify-content-center align-items-center gap-3">

                                        <i
                                            class="bi bi-pencil-square text-primary pointer"
                                            @click="router.push(`/school-calendar/edit/${holiday.groupId}`)"
                                        ></i>

                                        <i
                                            class="bi bi-trash3-fill text-danger pointer"
                                            @click="deleteHoliday(holiday.groupId)"
                                        ></i>

                                    </div>
                                </td>

                            </tr>

                        </tbody>
                    </table>

                </div>



            </div>





    </AdminNavbar>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminNavbar from '../../components/AdminNavbar.vue';
import API from '../../services/api.js';

const router = useRouter();

const holidays = ref([]);

const getHolidays = async () => {
    try {
        const token = localStorage.getItem("token");

        const academicYearId = selectedAcademicYear.value?.id;

        const res = await API.get("/api/calendar/holiday", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: academicYearId
                ? { academicYearId }
                : {}
        });

        holidays.value = res.data.holidays;
    

    } catch (err) {
        console.log(err.response.data.error);
    }
};

const academicYears = ref([]);
const selectedAcademicYear = ref(null);

const getAcademicYears = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await API.get("/api/academicyears", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        academicYears.value = res.data;

        const activeYear = academicYears.value.find(
            year => year.isActive
        );

        if (activeYear) {
            selectedAcademicYear.value = activeYear;
            await getHolidays();
        }

    } catch (err) {
        console.log(err.response.data.error);
    }
};

onMounted(getAcademicYears);


const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const deleteHoliday = async (groupId) => {

    const confirmDelete = confirm(
        "Are you sure you want to delete this holiday?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const res = await API.delete(
            `/api/calendar/holiday/${groupId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(res.data.message);

        await getHolidays();

    } catch (err) {
        alert(err.response.data.error);
    }
};


</script>