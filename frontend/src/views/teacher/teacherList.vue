
<template>
    <AdminNavbar>

    <div>
         <div class="sm-row p-0 m-0 p-md-5 d-md-flex align-items-center" >
            
             <div class="col-12  col-md-6 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0 gap-2">
                        <button class="btn btn-success fw-bold" >+ Add Teacher</button>
                        <button class="btn btn-success fw-bold" @click="selectFile" >Import CSV</button>
                        <input type="file" accept=".csv" hidden ref="fileInput" @change="handleFile">

                        
            </div>
             </div>

             <div class="table-responsive m-5">
                <table class="table  align-middle table-light table-opacity-50 border-secondary border-opacity-25 ">
                    <thead class="align-middle">
                        <tr>
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
                        <tr v-for="teacher in teachers" :key="teacher.id" >
                            <td >{{ teacher.empId }}</td>
                            <td>{{ teacher.user.name }}</td>
                            <td class="text-primary fw-semibold">{{ teacher.user.email }}</td>
                            <td>{{ teacher.gender }}</td>
                            <td>{{ formatDate(teacher.dob) }}</td>
                            <td>{{ teacher.classIncharge}}-{{teacher.classSection }}</td>
                            <td>{{ teacher.phone }}</td>
                            <td>{{ teacher.qualification }}</td>
                            <td >{{ teacher.addressLine1 }},<br>
                            {{ teacher.addressLine2 }},<br>
                            {{ teacher.city }},
                            {{ teacher.state }}</td>

                            <td>
                            <div class="d-flex justify-content-center align-items-center gap-3">
                            <i class="bi bi-pencil-square text-primary pointer" @click="router.push(`/student/edit/${student.id}`)"></i>
                            <i class="bi bi-trash3-fill text-danger pointer" @click="deleteStudent(student.id)"></i>
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
                    Successfully imported:
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
                <th>Reg No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="row in importResult.failedRows" :key="row.regno">
                <td>{{ row.regno }}</td>
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
    import {ref,onMounted} from 'vue';
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
    const showImportResult = ref(false)
    const selectFile = ()=>{
        fileInput.value.click()
    }
    const handleFile = async(event)=>{
        const file = event.target.files[0];
        
        if(!file) return;

        try{
        const formData = new FormData();
        formData.append("file",file);

        const token = localStorage.getItem("token");

        const res = await API.post("/api/teacher/upload",formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        importResult.value = res.data;
   
        if(res.data.failed > 0){
            showImportResult.value = true;
        }
       else{
        alert(res.data.message)
       }

      
        }

    

       catch(err){
        alert(err.response.data.message)
       }
         

    }

    </script>


