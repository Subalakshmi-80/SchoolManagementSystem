
<template>

    <component :is="navbarComponent">

        <div>

            <h1 class="fs-4 text-success text-center mt-3">
                Mark Attendance
            </h1>

            <div class="px-5 mt-4">

                <div class="card shadow-sm">

                    <div class="card-body">

                        <div class="row text-center">

                            <div class="col-md-4">

                                <div class="text-secondary small">
                                    Academic Year
                                </div>

                                <div class="fw-bold text-success">
                                    {{ academicYear.name }}
                                </div>

                            </div>


                            <div class="col-md-4">

                                <div class="text-secondary small">
                                    Class
                                </div>

                                <div class="fw-bold text-success">
                                    {{ classes.standard }} - {{ classes.name }}
                                </div>

                            </div>


                            <div class="col-md-4">

                                <div class="text-secondary small">
                                    Date
                                </div>

                                <div class="fw-bold text-success">
                                    {{ formatDate(date) }}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- Student List -->

            <div class="px-5 mt-4">

                <div
                    v-if="Students.length === 0"
                    class="text-danger text-center fw-bold"
                >
                    No students found.
                </div>


                <div
                    v-else
                    class="table-responsive w-75 mx-auto"
                >

                    <div class="text-center mb-3 fs-5 fw-bold text-success">
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

                                    <div
                                        class="d-flex justify-content-center align-items-center gap-2"
                                    >

                                        <!-- Present -->

                                        <button
                                            :ref="el => presentButtons[index] = el"
                                            type="button"
                                            class="btn btn-outline-success"
                                            :class="{
                                                active:
                                                    student.status === 'PRESENT'
                                            }"
                                            @click="
                                                student.status = 'PRESENT'
                                            "
                                            @keydown.enter="
                                                student.status = 'PRESENT';
                                                presentButtons[index + 1]?.focus()
                                            "
                                        >
                                            Present
                                        </button>


                                        <!-- Absent -->

                                        <button
                                            type="button"
                                            class="btn btn-outline-danger"
                                            :class="{
                                                active:
                                                    student.status === 'ABSENT'
                                            }"
                                            @click="
                                                student.status = 'ABSENT'
                                            "
                                            @keydown.enter="
                                                student.status = 'ABSENT';
                                                presentButtons[index + 1]?.focus()
                                            "
                                        >
                                            Absent
                                        </button>


                                        <!-- Required -->

                                        <div
                                            v-if="
                                                showValidation &&
                                                !student.status
                                            "
                                            class="text-danger small fw-bold ms-2"
                                        >
                                            Required
                                        </div>

                                    </div>

                                </td>

                            </tr>

                        </tbody>

                    </table>


                    <!-- Buttons -->

                    <div
                        class="d-flex justify-content-center my-4 gap-3"
                    >

                        <button
                            type="button"
                            class="btn btn-outline-success px-4"
                            @click="saveAttendance"
                        >

                            {{
                                attendanceExists
                                    ? "Update Attendance"
                                    : "Save Attendance"
                            }}

                        </button>


                        <button
                            type="button"
                            class="btn btn-outline-secondary px-4"
                            @click="goBack"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </div>

    </component>

</template>


<script setup>

import { ref, onMounted } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import AdminNavbar from '../../components/AdminNavbar.vue';

import TeacherNavbar from '../../components/TeacherNavbar.vue';

import API from '../../services/api';


const route = useRoute();

const router = useRouter();

const role = localStorage.getItem("role");

const navbarComponent =
    role === "teacher"
        ? TeacherNavbar
        : AdminNavbar;

const academicYearId = route.query.academicYearId;

const classId = route.query.classId;

const date = route.query.date;
const Students = ref([])
const academicYear = ref({});
const classes = ref({});

const showValidation = ref(false);
const attendanceExists = ref(false);
const presentButtons = ref([]);

const getAttendance = async () => {

    try {

        const token =localStorage.getItem("token");
        const res = await API.get("/api/attendance",{
                headers: {
                    Authorization:`Bearer ${token}`
                },
                params: {
                    class_id:classId,
                    date:date,
                    academicYearId:academicYearId
                }
            })

        Students.value =res.data.students;
        academicYear.value =res.data.academicYear;
        classes.value =res.data.class;

        attendanceExists.value =
            Students.value.length > 0 &&
            Students.value.every(
                student => student.status
            );

    }

    catch (err) {
        alert(
            err.response?.data?.error ||
            "Unable to get attendance."
        )
        console.log(err.response?.data?.error)
    }
}

const formatDate = (date) => {

    if (!date) return "";

    const [year, month, day] =
        date.split("-");

    return `${day}-${month}-${year}`;

};


const saveAttendance = async () => {

    showValidation.value = true;


    const unMarkedIndex =
        Students.value.findIndex(
            student => !student.status
        );


    if (unMarkedIndex !== -1) {

        presentButtons.value[
            unMarkedIndex
        ]?.focus();

        return;

    }
    try {
        const token =localStorage.getItem("token");
        const attendance =Students.value.map(student => ({
                student_id:student.studentId,
                status:student.status
            }))
        const data = {
            class_id:Number(classId),
            date:date,
            academicYearId:Number(academicYearId),
            attendance:attendance
        }

        let res
        if (attendanceExists.value) {
            res = await API.put("/api/attendance",data,{
                    headers: {
                        Authorization:`Bearer ${token}`
                    }
                })
        }
        else {
            res = await API.post( "/api/attendance",data,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        }
        alert(res.data.message);
        attendanceExists.value = true;

        if (role === "admin") {
            router.push("/attendance/list");
        }
        else if (role === "teacher") {
            router.push("/attendance/teacher/list");
        }
    }
    catch (err) {
        alert(
            err.response?.data?.error ||
            "Something went wrong. Please try again."
        )
        console.log(err.response?.data?.error)
    }
}


const goBack = () => {

    if (role === "admin") {
        router.push("/attendance/list");
    }
    else if (role === "teacher") {
        router.push("/attendance/teacher/list");
    }
}

onMounted(() => {
    getAttendance();
})

</script>

