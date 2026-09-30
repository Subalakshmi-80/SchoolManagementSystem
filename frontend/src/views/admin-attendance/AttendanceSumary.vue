
<template>

    <component :is="navbarComponent">

        <div>

            <div class="d-flex justify-content-between align-items-center px-5 mt-3">
                <div class="fs-4 fw-bold text-success">
                    Attendance Summary
                </div>
            </div>


            <div class="d-flex align-items-center px-5 my-4 gap-3">   
                <div class="dropdown">

                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown">
                        {{
                            selectedAcademicYear
                                ? selectedAcademicYear.name
                                : "Select Academic Year"
                        }}
                    </button>

                    <ul class="dropdown-menu">

                        <li
                            v-for="year in academicYear"
                            :key="year.id">

                            <button
                                class="dropdown-item"
                                type="button"
                                @click="selectAcademicYear(year)">

                                {{ year.name }}
                            </button>

                        </li>

                    </ul>

                </div>

                <div class="dropdown">

                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown">
                        {{
                            selectedClass
                                ? `${selectedClass.standard.name} - ${selectedClass.name}`
                                : "Select Class"
                        }}
                    </button>

                    <ul class="dropdown-menu">

                        <li
                            v-for="cls in classes"
                            :key="cls.id">

                            <button
                                class="dropdown-item"
                                type="button"
                                @click="selectClass(cls)">

                                {{ cls.standard.name }} - {{ cls.name }}
                            </button>

                        </li>

                    </ul>

                </div>


                <input
                    type="month"
                    class="form-control w-auto"
                    v-model="selectedMonth"
                    @change="clearError"
                />

                <button
                    type="button"
                    class="btn btn-outline-success"
                    @click="viewSummary"
                >
                    View
                </button>

            </div>


            <div
                v-if="errorMessage"
                class="text-danger fw-bold px-5">
                {{ errorMessage }}
            </div>


            <div v-if="summaryData" class="px-5 mt-4">

                <div class="fw-bold mb-3 text-success">

                    {{ summaryData.class.name }} -
                    {{ summaryData.class.standard }} |

                    {{ formatMonth(summaryData.month) }} |

                    Working Days:
                    {{ summaryData.workingDays }}

                </div>

                <table v-if="summaryData.students.length > 0"
                    class="table table-responsive table-hover w-75 mx-auto mt-4">

                    <thead>

                        <tr>

                            <th>S.No</th>
                            <th>Reg No</th>
                            <th>Student Name</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Attendance %</th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr v-for="(student,index) in summaryData.students" :key="student.studentId">

                            <td>{{ index + 1 }}</td>

                            <td>
                                {{ student.regNo }}
                            </td>

                            <td>
                                {{ student.name }}
                            </td>

                            <td>
                                {{ student.present }}
                            </td>

                            <td>
                                {{ student.absent }}
                            </td>

                            <td>
                                {{ student.percentage }}%
                            </td>

                        </tr>

                    </tbody>

                </table>


                <div
                    v-else
                    class="text-danger fw-bold text-center mt-4">
                    No attendance records found for the selected month.
                </div>

            </div>

        </div>

    </component>

</template>


<script setup>
import AdminNavbar from "../../components/AdminNavbar.vue";
import TeacherNavbar from "../../components/TeacherNavbar.vue";

const role = localStorage.getItem("role");

const navbarComponent =
    role === "teacher"
        ? TeacherNavbar
        : AdminNavbar;
    
import { ref, onMounted } from 'vue';
import API from '../../services/api';


const academicYear = ref([]);
const selectedAcademicYear = ref(null);

const classes = ref([]);
const selectedClass = ref(null);

const selectedMonth = ref("");

const errorMessage = ref("");

const summaryData = ref(null);

const clearError = () => {
    errorMessage.value = "";

};


const selectAcademicYear = (year) => {

    selectedAcademicYear.value = year;
    clearError();
    summaryData.value = null;

}

const selectClass = (cls) => {
    selectedClass.value = cls;
    clearError();
    summaryData.value = null;

};

const getAcademicYears = async () => {

    try {

        const token = localStorage.getItem("token");
        const res = await API.get('/api/academicyears', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        academicYear.value = res.data;

        const activeYear = academicYear.value.find(
            year => year.isActive
        )

        if (activeYear) {
            selectedAcademicYear.value = activeYear;
        }

    } catch (err) {
        errorMessage.value = err.response?.data?.error || "Unable to get academic years.";
    }

}

const getclasses = async () => {

    try {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if(role === "teacher"){
            const res = await API.get("/api/teacher/myClass",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            classes.value = [res.data];
            selectedClass.value = res.data;
            
        }
        else{
        const res = await API.get("/api/classes", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        classes.value = res.data;
    }
    } catch (err) {
        errorMessage.value = err.response?.data?.error ||"Unable to get classes.";
    }
}

const viewSummary = async () => {

    errorMessage.value = "";
    if (!selectedAcademicYear.value) {

        errorMessage.value = "Please select academic year.";
        return;
    }

    if (!selectedClass.value) {

        errorMessage.value = "Please select class.";
        return;
    }
    if (!selectedMonth.value) {

        errorMessage.value ="Please select month.";
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/attendance/summary",{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    class_id:selectedClass.value.id,
                    academicYearId:selectedAcademicYear.value.id,
                    month:selectedMonth.value
                }
            }
        )
        summaryData.value = res.data;
        errorMessage.value = "";

    } catch (err) {

        errorMessage.value = err.response?.data?.error || "Unable to get attendance summary.";
        summaryData.value = null;
    }
}


const formatMonth = (month) => {

    if (!month) {
        return "";
    }

    const [year, monthNumber] = month.split("-");
    const date = new Date(
        Number(year),
        Number(monthNumber) - 1
    )

    return date.toLocaleString("en-US",{
            month: "long",
            year: "numeric"
        }
    )
}


onMounted(() => {
    getAcademicYears();
    getclasses();
})

</script>
