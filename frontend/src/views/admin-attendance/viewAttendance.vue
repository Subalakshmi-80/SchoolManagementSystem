
<template>

    <component :is="navbarComponent">

        <div>

            <h1 class="fs-4 text-success text-center mt-3">
                View Attendance
            </h1>

            <div class="d-flex align-items-center px-5 my-4 gap-3">
                <div class="dropdown">

                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        data-bs-toggle="dropdown"
                    >

                        {{
                            selectedAcademicYear?.name ||
                            "Academic Year"
                        }}

                    </button>


                    <ul class="dropdown-menu">

                        <li
                            v-for="academicYear in academicYears"
                            :key="academicYear.id"
                        >
                            <button
                                class="dropdown-item"
                                type="button"
                                @click="
                                    selectedAcademicYear = academicYear;
                                    getAttendance()
                                "
                            >

                                {{ academicYear.name }}

                            </button>

                        </li>

                    </ul>

                </div>
                <div v-if="role === 'admin'" class="dropdown">

                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        data-bs-toggle="dropdown"
                    >

                        {{
                            selectedClass
                                ? `${selectedClass.standard.name} - ${selectedClass.name}`
                                : "Class"
                        }}

                    </button>


                    <ul class="dropdown-menu">

                        <li
                            v-for="classItem in classes"
                            :key="classItem.id"
                        >

                            <button
                                class="dropdown-item"
                                type="button"
                                @click="
                                    selectedClass = classItem;
                                    getAttendance()
                                "
                            >

                                {{ classItem.standard.name }} -
                                {{ classItem.name }}

                            </button>

                        </li>

                    </ul>

                </div>


                <!-- Teacher Assigned Class -->

                <div v-else>

                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        disabled
                    >

                        {{
                            selectedClass
                                ? `${selectedClass.standard.name} - ${selectedClass.name}`
                                : "Loading Class..."
                        }}

                    </button>

                </div>


                <!-- Date -->

                <div>

                    <input
                        type="date"
                        class="form-control"
                        v-model="selectedDate"
                    >

                </div>


                <!-- View -->

                <button
                    type="button"
                    class="btn btn-outline-success"
                    @click="getAttendance"
                >

                    View

                </button>

            </div>


            <!-- Error -->

            <div
                v-if="errorMessage"
                class="text-danger fw-bold px-5 mb-3"
            >

                {{ errorMessage }}

            </div>


            <!-- Attendance -->

            <div
                v-if="attendanceMarked"
                class="px-5 mt-4"
            >

                <!-- Attendance Details Card -->

                <div class="card shadow-sm">

                    <div class="card-body position-relative">

                        <!-- Edit -->

                        <button
                            type="button"
                            class="btn btn-outline-danger position-absolute top-0 end-0 m-2"
                            title="Edit Attendance"
                            @click="editAttendance"
                        >

                            <i class="bi bi-pencil"></i>

                        </button>


                        <div class="row text-center">

                            <!-- Academic Year -->

                            <div class="col-md-4">

                                <div class="text-secondary small">
                                    Academic Year
                                </div>

                                <div class="fw-bold text-success">

                                    {{ academicYear.name }}

                                </div>

                            </div>


                            <!-- Class -->

                            <div class="col-md-4">

                                <div class="text-secondary small">
                                    Class
                                </div>

                                <div class="fw-bold text-success">

                                    {{ selectedClass?.standard?.name }}
                                    -
                                    {{ selectedClass?.name }}

                                </div>

                            </div>


                            <!-- Date -->

                            <div class="col-md-4">

                                <div class="text-secondary small">
                                    Date
                                </div>

                                <div class="fw-bold text-success">

                                    {{ formatDate(selectedDate) }}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- Student Table -->

                <div class="table-responsive w-75 mx-auto mt-4">

                    <div
                        class="text-center mb-3 fs-5 fw-bold text-success"
                    >

                        Student List

                    </div>


                    <table class="table table-hover">

                        <thead>

                            <tr class="text-center">

                                <th>S.No</th>
                                <th>Register No</th>
                                <th>Student Name</th>
                                <th>Attendance</th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr
                                v-for="(student, index) in Students"
                                :key="student.studentId"
                                class="text-center align-middle"
                            >

                                <td>
                                    {{ index + 1 }}
                                </td>

                                <td>
                                    {{ student.regNo }}
                                </td>

                                <td>
                                    {{ student.name }}
                                </td>

                                <td>

                                    <span
                                        v-if="
                                            student.status === 'PRESENT'
                                        "
                                        class="badge bg-success"
                                    >

                                        Present

                                    </span>


                                    <span
                                        v-else-if="
                                            student.status === 'ABSENT'
                                        "
                                        class="badge bg-danger"
                                    >

                                        Absent

                                    </span>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>


                <!-- Back -->

                <div
                    class="d-flex justify-content-center gap-3 my-4"
                >

                    <button
                        type="button"
                        class="btn btn-outline-secondary px-4"
                        @click="goBack"
                    >

                        Back

                    </button>

                </div>

            </div>

            <div
                v-if="
                    selectedAcademicYear &&
                    selectedClass &&
                    selectedDate &&
                    !attendanceMarked &&
                    !loading
                "
                class="text-center mt-5"
            >

                <div class="text-danger fw-bold mb-3">

                    Attendance not marked yet for the selected date.

                </div>


                <button
                    type="button"
                    class="btn btn-outline-success"
                    @click="editAttendance"
                >

                    Mark Attendance

                </button>

            </div>

        </div>

    </component>

</template>


<script setup>

import { computed, onMounted, ref } from "vue";
import AdminNavbar from "../../components/AdminNavbar.vue";
import TeacherNavbar from "../../components/TeacherNavbar.vue";
import API from "../../services/api";
import { useRouter, useRoute } from "vue-router";


const router = useRouter();
const route = useRoute();

const role =localStorage.getItem("role");


const navbarComponent = computed(() => {
    return role === "teacher"
        ? TeacherNavbar
        : AdminNavbar;
});

const loading = ref(false);
const errorMessage = ref("");
const attendanceMarked = ref(false);

const academicYears = ref([]);
const selectedAcademicYear = ref(null);

const classes = ref([]);
const selectedClass = ref(null);

const selectedDate = ref("");


const Students = ref([]);
const academicYear = ref({});

const formatDate = (date) => {

    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`
}

const getAcademicYears = async () => {

    try {
     const token =localStorage.getItem("token");
        const res = await API.get( "/api/academicyears",{
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
        academicYears.value =res.data;
    }
    catch (err) {
        errorMessage.value = err.response?.data?.error || "Unable to get academic years.";

    }

}

const getClasses = async () => {

    if (role !== "admin") {
        return;
    }
    try {
        const token =localStorage.getItem("token");
        const res = await API.get("/api/classes",{
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
        classes.value =res.data;
    }
    catch (err) {
        errorMessage.value =err.response?.data?.error ||"Unable to get classes.";

    }
}

const getTeacherClass = async () => {
    if (role !== "teacher") {
        return;
    }
    try {
        const token =localStorage.getItem("token");
        const res = await API.get( "/api/teacher/myClass",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        selectedClass.value =res.data
    }
    catch (err) {
        errorMessage.value =err.response?.data?.error ||"Unable to get your assigned class.";
    }
}
const getAttendance = async () => {

    errorMessage.value = "";
    attendanceMarked.value = false;
    Students.value = [];
    if (!selectedAcademicYear.value) {
        return;
    }
    if (!selectedClass.value) {
        return;
    }
    if (!selectedDate.value) {
        return;
    }
    try {

        loading.value = true
        const token = localStorage.getItem("token");
        const res = await API.get("/api/attendance",
            {
                headers: {
                    Authorization:`Bearer ${token}`
                },

                params: {
                    class_id:selectedClass.value.id,
                    date:selectedDate.value,
                    academicYearId:selectedAcademicYear.value.id
                }
            })


        Students.value =res.data.students || [];
        attendanceMarked.value =
            Students.value.length > 0 &&
            Students.value.every(
                student => student.status
            )
        academicYear.value =res.data.academicYear ||selectedAcademicYear.value;
    }
    catch (err) {
        errorMessage.value =err.response?.data?.error ||"Unable to get attendance.";
    }

    finally {
        loading.value = false;
    }
}


const editAttendance = () => {

    if (
        !selectedAcademicYear.value ||
        !selectedClass.value ||
        !selectedDate.value
    ) {
     return
    }

    router.push({
        path: "/attendance/mark",
        query: {
            academicYearId:selectedAcademicYear.value.id,
            classId:selectedClass.value.id,
            date:selectedDate.value
        }
    })

}

const goBack = () => {
    if (role === "teacher") {
        router.push("/attendance/teacher/list")
    }
    else {
        router.push("/attendance/list")
    }
}


onMounted(async () => {
    await getAcademicYears();
    if (role === "admin") {
        await getClasses();
    }

    else if (role === "teacher") {
        await getTeacherClass();
    }

    const academicYearId =Number(route.query.academicYearId);
    const classId =Number(route.query.classId);
    const selectedDateFromRoute =route.query.date;
    if (academicYearId) {

        selectedAcademicYear.value =
            academicYears.value.find(
                year =>
                    year.id === academicYearId
            ) || null;

    }

    if (role === "admin" && classId) {

        selectedClass.value =
            classes.value.find(
                classItem =>
                    classItem.id === classId
            ) || null;

    }

    if (
        role === "teacher" &&
        !selectedClass.value
    ) {

        await getTeacherClass();

    }

    selectedDate.value =
        selectedDateFromRoute || "";
    if (
        selectedAcademicYear.value &&
        selectedClass.value &&
        selectedDate.value
    ) {

        await getAttendance();

    }

});

</script>
