
<template>
    <AdminNavbar>

    <div>
         <div class="sm-row p-0 m-0 p-md-5 pb-md-2 d-md-flex align-items-center justify-content-between" >
            
             <div class="col-12  col-md-4 d-flex justify-content-center justify-content-md-start mb-md-0 gap-2">
                        <button class="btn btn-success fw-bold" @click="router.push('/teacher/create')">+ Add Teacher</button>
                        <button class="btn btn-success fw-bold" @click="selectFile" :disabled="uploading">
                                {{ uploading ? 'Uploading...' : 'Import CSV' }}</button>

                        <input type="file" accept=".csv" hidden ref="fileInput" @change="handleFile">

                          <div v-if="uploading" class="d-flex align-items-center gap-2 mt-2">
                                <div class="spinner-border spinner-border-sm text-success" role="status"></div>
                                <span class="fw-semibold">Importing teachers...</span>
                            </div>
                        
            </div>

            <div class="col-12 col-md-2">
                        <div class="stats-box text-center">
                            <small>
                                Total Teachers
                            </small>
                            <h5 class="fw-bold">
                                {{ totalTeachers }}
                            </h5>
                        </div>
                    </div>

            <div class="col-12 col-md-5 ">
                  <div class="input-group search-box ">
                    <input type="search" placeholder="Search teacher..." v-model="search" class="form-control shadow-none border-secondary border-opacity-50">

                        <i class="bi bi-search input-group-text bg-secondary text-white pointer"></i>
                    </div>

                <div>

                </div>
            </div>
             </div>

            <div class="sm-row p-0 m-0 d-md-flex align-items-center justify-content-md-end gap-2">

    <div class="col-12 col-md-auto d-flex justify-content-center align-items-center gap-2 mb-3 mb-md-0">
        <i
            class="bi bi-chevron-left bg-secondary bg-opacity-25 text-center h-25 p-1 rounded pointer"
            @click="previousPage"
        ></i>

        <p class="bg-success p-1 px-2 h-25 m-0 text-white fw-bold">
            {{ currentPage }}/{{ totalPages }}
        </p>

        <i
            class="bi bi-chevron-right bg-secondary bg-opacity-25 text-center h-25 p-1 rounded pointer"
            @click="nextPage"
        ></i>
    </div>

    <div class="col-12 col-md-auto d-flex justify-content-center align-items-center gap-2 mb-3 mb-md-0">
        <p class="m-0">Go to</p>

        <input
            type="text"
            v-model.number="goToPageNumber"
            @keyup.enter="goToPage"
            class="text-center form-control shadow-none border-secondary border-opacity-50"
            style="width: 50px;"
        />
    </div>

    <div class="col-12 col-md-3 d-flex align-items-center justify-content-center mb-3 mb-md-0">
        <select
            class="form-select w-50 text-center shadow-none border-secondary border-opacity-50"
            v-model.number="itemPerPage"
        >
            <option :value="10">10/page</option>
            <option :value="20">20/page</option>
            <option :value="30">30/page</option>
        </select>
    </div>

</div>

             <div class="table-responsive m-5 ">
             <div v-if="filteredTeachers.length === 0" class="text-danger fw-bold text-center">
    No Teachers found
</div>
                <table v-else  class="table  table-hover align-middle table-light table-opacity-50 border-secondary border-opacity-25 ">
                    <thead class="align-middle text-center">
                        <tr>
                            <th>S.No</th>
                            <th>Emp Id</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>DOB</th>
                            <th>Class Incharge</th>
                            <th>Phone</th>
                            <th>Qualification</th>
                            <th>Address</th>
                            <th>Actions</th>
                        
                        </tr>
                    
                    </thead>

                    <tbody  >
                        <tr v-for="(teacher,index) in paginatedTeachers" :key="teacher.id" class="text-center align-middle">
                             <td>{{ (currentPage - 1) * itemPerPage + index + 1 }}</td>
                            <td >{{ teacher.empId }}</td>
                            <td>{{ teacher.user.name }}</td>
                            <td class="text-primary fw-semibold">{{ teacher.user.email }}</td>
                            <td>{{ teacher.gender }}</td>
                            <td>{{ formatDate(teacher.dob) }}</td>
                            <td v-if="teacher.classIncharge !== 'No' || ''" >{{teacher.classSection }}</td>
                            <td v-else>-</td>
                            <td>{{ teacher.phone }}</td>
                            <td>{{ teacher.qualification }}</td>
                            <td class="text-start">{{ teacher.addressLine1 }},<br>
                            {{ teacher.addressLine2 }},<br>
                            {{ teacher.city }},
                            {{ teacher.state }}</td>

                            <td>
                            <div class="d-flex justify-content-center align-items-center gap-3">
                            <i class="bi bi-pencil-square text-primary pointer" @click="router.push(`/teacher/edit/${teacher.id}`)"></i>
                            <i class="bi bi-trash3-fill text-danger pointer" @click="deleteTeacher(teacher.id)"></i>
                            </div>
                            </td>
                        </tr>
                    
                    </tbody>
                
                </table>
                
                </div>

            <div v-if="showImportResult" class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg ">
        <div class="modal-content bg-light">

            <div class="modal-header">
                <h5 class="modal-title">
                    Import Result
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    @click="showImportResult = false"
                ></button>

                
            </div>

            <div class="modal-body">

                <p>
                    Total Records:
                    <strong>{{ importResult.success+importResult.failed }}</strong>
                </p>
                <p>
                    Successfully created:
                    <strong>{{ importResult.success }}</strong>
                </p>

                <p>
                    Failed:
                    <strong>{{ importResult.failed }}</strong>
                </p>

                <div v-if="importResult.failed > 0" class="table-responsive mt-3">

    <h6>Failed Records</h6>

    <table class="table table-bordered table-sm">

        <thead>
            <tr>
                <th>Emp Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="row in importResult.failedRows" :key="row.regno">
                <td>{{ row.empId }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.reason }}</td>
            </tr>
        </tbody>

    </table>

</div>

            </div>

            <div class="modal-footer">
                <button
                    class="btn btn-secondary"
                    @click="showImportResult = false"
                >
                    Close
                </button>
            </div>

        </div>
    </div>
</div>

     
    </div>
         
    </AdminNavbar>

    </template>


<script setup>
    import AdminNavbar from '../../components/AdminNavbar.vue';
    import {ref,onMounted,computed,watch} from 'vue';
    import { useRouter } from 'vue-router';
    import API from "../../components/api.js";

    const router = useRouter();
    
    const teachers = ref([]);

    const  getTeachers = async() =>{
    try{
        const token = localStorage.getItem("token");
        
        const res = await API.get("/api/teacher",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        
        })
        teachers.value= res.data  
    }catch(err){
    console.log("Error Fetching Students ",err)
    }
    }
    onMounted(getTeachers);
    

    const formatDate = (date) =>{
        if(!date) return "";
        const newdate = new Date(date);
        return newdate.toLocaleDateString('en-GB')  //format date
    }

const fileInput = ref(null);
    const importResult = ref(null)
    const showImportResult = ref(false);

    const uploading = ref(false);
    const selectFile = ()=>{
        fileInput.value.click()
    }
    const handleFile = async(event)=>{
        const file = event.target.files[0];
        
        if(!file) return;

        try{
        
        const formData = new FormData();
        formData.append("file",file);
        uploading.value = true;
        const token = localStorage.getItem("token");

        const res = await API.post("/api/teacher/upload",formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        importResult.value = res.data;
        showImportResult.value=true;
        uploading.value = false;

        await getTeachers();
        

      
        }

    

       catch(err){
          uploading.value = false;
    alert(err.response?.data?.message || "CSV upload failed");
       }
         

    }

    const totalTeachers = computed(()=> teachers.value.length);

    const search = ref("");
    const filteredTeachers = computed(()=>{
        let result = teachers.value;

        if(search.value.trim()!== ""){
            result = result.filter(teacher =>
                teacher.empId.toLowerCase().includes(search.value.toLowerCase()) ||
                teacher.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
                teacher.user.email.toLowerCase().includes(search.value.toLowerCase()) 
            )
        }
        return result;
    })

    const currentPage = ref(1);
const itemPerPage = ref(10);

const totalPages = computed(() => {
    return Math.ceil(filteredTeachers.value.length / itemPerPage.value);
});

const paginatedTeachers = computed(() => {
    const start = (currentPage.value - 1) * itemPerPage.value;
    const end = start + itemPerPage.value;

    return filteredTeachers.value.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        goToPageNumber.value = "";
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        goToPageNumber.value = "";
    }
};

const goToPageNumber = ref("");

const goToPage = () => {
    if (
        goToPageNumber.value >= 1 &&
        goToPageNumber.value <= totalPages.value
    ) {
        currentPage.value = goToPageNumber.value;
    }
};

watch(search, () => {
    currentPage.value = 1;
    goToPageNumber.value = "";
});

watch(itemPerPage, () => {
    currentPage.value = 1;
    goToPageNumber.value = "";
});


const deleteTeacher = async(teacherId)=>{
    const confirmDelete = confirm("Are you sure you want to delete this teacher?");

    if(!confirmDelete){
        return;
    }

    try{
        const token =  localStorage.getItem("token");

        const res = await API.delete(`/api/teacher/${teacherId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        alert(res.data.message);

        await getTeachers();

        if(currentPage.value > totalPages.value){
            currentPage.value = Math.max(1,totalPages.value)
        }
    }catch(err){
        alert(err.response?.data?.error || "Failed to delete teacher")
    }

}
    </script>



<style scoped>
table th{
    font-size: 14px;
}
table td{
    font-size: 12px;
}
</style>