
<template>
    <AdminNavbar>
        <div>
            
            <div class="d-flex justify-content-between align-items-center px-5 mt-3">
                <h1 class="fs-4 text-success">
                    Attendance
                </h1>
            </div>

           
            <div class="d-flex align-items-center px-5 my-4 gap-3">

                
                <div class="dropdown">
                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {{ selectedAcademicYear
                            ? selectedAcademicYear.name
                            : "Select Academic Year" }}
                    </button>

                    <ul class="dropdown-menu">
                        <li
                            v-for="academicYear in academicYears"
                            :key="academicYear.id"
                        >
                            <button
                                class="dropdown-item"
                                type="button"
                                @click="selectedAcademicYear = academicYear;checkSelectedDate(); checkExistingAttendance()"
                            >
                                {{ academicYear.name }}
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Class -->
                <div class="dropdown">
                    <button
                        class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        {{ selectedClass
                            ? `${selectedClass.standard.name} - ${selectedClass.name}`
                            : "Select Class" }}
                    </button>

                    <ul class="dropdown-menu">
                        <li
                            v-for="classItem in classes"
                            :key="classItem.id"
                        >
                            <button
                                class="dropdown-item"
                                type="button"
                                @click="selectedClass = classItem ;checkExistingAttendance()"

                            >
                                {{ classItem.standard.name }} - {{ classItem.name }}
                            </button>
                        </li>
                    </ul>
                </div>

               
                <div>
                    <input
                        type="date"
                        class="form-control"
                        v-model="selectedDate"
                        @change="checkSelectedDate(); checkExistingAttendance()"
                    >
                </div>

            </div>

            
            <div class="d-flex px-5 gap-3">

          
                <button class="btn btn-success" @click="markAttendance" :disabled="attendanceBlocked">
                   {{ attendanceExits ? "Edit Attendance" : "Mark Attendance" }}
                </button>

                <button class="btn btn-outline-success" @click="viewAttendance">
                    View Attendance
                </button>

                <button class="btn btn-outline-primary" @click="router.push('/attendance/summary')">
                    View Summary
                </button>
            </div>

              <div
    v-if="errorMessage"
    class="text-danger fw-bold px-5 mb-3"
>
    {{ errorMessage }}
</div>

        </div>
    </AdminNavbar>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AdminNavbar from '../../components/AdminNavbar.vue';
import API from '../../services/api.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const academicYears = ref([]);
const selectedAcademicYear = ref(null);

const classes = ref([]);
const selectedClass = ref(null);

const selectedDate = ref("");

const errorMessage = ref("");
const attendanceBlocked = ref(false)


const attendanceExits = ref(false);

const checkSelectedDate = async() =>{
    errorMessage.value ="";
    attendanceBlocked.value = false

    if(!selectedDate.value || !selectedAcademicYear.value){
        return;
    }

    try{
        const token = localStorage.getItem("token");

        const today = new Date();
        const currentDate = today.toISOString().split("T")[0];

        if (selectedDate.value > currentDate) {
            attendanceBlocked.value = true;
            errorMessage.value =
                "Attendance cannot be marked for a future date.";
            return;
        }

        const date = new Date(`${selectedDate.value}T00:00:00`);

        if (date.getDay() === 0) {
            attendanceBlocked.value = true;
            errorMessage.value =
                "Attendance cannot be marked. Sunday is a weekly off.";
            return;
        }


        const res = await API.get("/api/calendar/date",{
            params:{
                date:selectedDate.value,
                academicYearId:selectedAcademicYear.value.id
            },
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        if(res.data.isBlocked){
            attendanceBlocked.value = true;

            if(res.data.type === "HOLIDAY"){
                errorMessage.value =
                    `Attendance cannot be marked. It is a holiday: ${res.data.reason}`;
            }
            else if(res.data.type === "WEEKLY_OFF"){
                errorMessage.value =
                    `Attendance cannot be marked. It is a weekly off: ${res.data.reason}`;
            }
        }
       

    }catch(err){
        errorMessage.value=err.response?.data?.error || "Unable to check selected date."
        attendanceBlocked.value = true
    }
}

const checkExistingAttendance = async() =>{
    attendanceExits.value = false;

    if(!selectedDate.value || !selectedAcademicYear.value || !selectedClass.value){
        return
    }
    try{
        const token = localStorage.getItem("token");
        const res = await API.get("/api/attendance",{
            headers:{
                Authorization:`Bearer ${token}`
            },
            params:{
                class_id:selectedClass.value.id,
                date:selectedDate.value,
                academicYearId:selectedAcademicYear.value.id
            }
        })

        const students = res.data.students || [];

        attendanceExits.value = students.length>0 && students.every(student =>student.status)
    }catch(err){
        console.log(err.response?.data?.error);
    }
}

const setTodayDate = () =>{
    const today = new Date();
    selectedDate.value= today.toISOString().split("T")[0];
    
}
const getAcademicYears = async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/academicyears",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        academicYears.value = res.data;

        const activeYear = academicYears.value.find(
            year => year.isActive
        )

        if(activeYear){
            selectedAcademicYear.value = activeYear;
            checkSelectedDate()
        }
    }catch(err){
        console.log(err.response.data.error);
    }
}

const getclasses =async()=>{
    try{
        const token = localStorage.getItem("token");

        const res = await API.get("/api/classes",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        classes.value=res.data;
    }catch(err){
        console.log(err.response.data.error)
    }
}


const markAttendance = () =>{
    errorMessage.value ="";

    if(!selectedAcademicYear.value){
         errorMessage.value="Please select academic year."
         return
    }

    if(!selectedClass.value){
         errorMessage.value = "Please select class."
         return
    }
    if(!selectedDate.value){
         errorMessage.value = "Please select date."
         return
    }

    router.push({
        path:'/attendance/mark',
        query:{
            academicYearId:selectedAcademicYear.value.id,
            classId:selectedClass.value.id,
            date:selectedDate.value
        }
    })
}


const viewAttendance = () => {

    errorMessage.value = "";

    if(!selectedAcademicYear.value){
        errorMessage.value = "Please select academic year.";
        return;
    }

    if(!selectedClass.value){
        errorMessage.value = "Please select class.";
        return;
    }

    if(!selectedDate.value){
        errorMessage.value = "Please select date.";
        return;
    }

    router.push({
        path: "/attendance/view",
        query: {
            academicYearId: selectedAcademicYear.value.id,
            classId: selectedClass.value.id,
            date: selectedDate.value
        }
    });
};





onMounted(()=>{
   setTodayDate(); 
   getAcademicYears();
    getclasses();
    
})

</script>
