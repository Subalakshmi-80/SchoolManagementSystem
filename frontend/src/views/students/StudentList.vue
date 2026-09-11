    <template>

    <AdminNavbar>
            <div>

                <div class="sm-row p-0 m-0 p-md-5 d-md-flex align-items-center justify-content-md-between" >

                    
                    <div class="col-12  col-md-4 d-flex flex-column   mb-3 mb-md-0 gap-2">
                        <div class="d-flex gap-2 align-items-center">
                            <button class="btn btn-success fw-bold" @click="router.push('/student/create')">+ Add Student</button>
                        
                            <button class="btn btn-success fw-bold" @click="selectFile" :disabled="uploading">
                                {{ uploading ? 'Uploading...' : 'Import CSV' }}</button>

                            <input type="file" accept=".csv" hidden ref="fileInput" @change="handleFile">

                            <div v-if="uploading" class="d-flex align-items-center gap-2 mt-2">
                                <div class="spinner-border spinner-border-sm text-success" role="status"></div>
                                <span class="fw-semibold">Importing students...</span>
                            </div>
                        </div>
                           
                    </div>

                    <div class="col-12 col-md-2">
                        <div class="stats-box text-center">
                            <small>
                                {{ selectedClassId ? `Students in ${selectedClassName}` : 'Total Students' }}
                            </small>
                            <h5 class="fw-bold">
                                {{ selectedClassId ? filteredStudents.length : totalStudents }}
                            </h5>
                        </div>
                    </div>
               
                    <div class="d-flex col-12 col-md-6 gap-3 justify-content-center justify-content-md-end mb-3 mb-md-0" >

                    <div class="dropdown ms-5">
                    <button class="btn btn-light border dropdown-toggle" type="button" data-bs-toggle="dropdown">{{ selectedClassName }}</button>

                        <ul class="dropdown-menu class-dropdown">

                            <li>
                                <button class="dropdown-item" @click="selectClass('','All classes')">
                                    All Classes
                                </button>
                            </li>

                            <li v-for="cls in classes" :key="cls.id">

                                <button class="dropdown-item" @click="selectClass(cls.id,`${cls.standard.name}-${cls.name}`)">{{ cls.standard.name }}-{{ cls.name }}</button>
                            </li>
                        </ul>
                    </div>
                        
                    <div class="input-group search-box w-75 w-md-50">
                    <input type="search" placeholder="Search student..." v-model="search" class="form-control shadow-none border-secondary border-opacity-50">

                        <i class="bi bi-search input-group-text bg-secondary text-white pointer"></i>
                    </div>

                   
                    
                    </div>
                </div>

                <div class="sm-row p-0 m-0 d-md-flex align-items-center justify-content-md-end gap-2">

                    <div class="col-12  col-md-auto d-flex justify-content-center align-items-center gap-2 mb-3 mb-md-0">
                        <i class="bi bi-chevron-left bg-secondary bg-opacity-25 text-center h-25 p-1 rounded pointer" 
                        @click="previousPage"></i>

                        <p class="bg-success p-1 px-2 h-25 m-0 text-white fw-bold">{{ currentPage }}/{{ totalPages }}</p>
                        
                        <i class="bi bi-chevron-right bg-secondary bg-opacity-25 text-center h-25 p-1 rounded pointer"
                        @click="nextpage"></i>
                    </div>


                    <div class="col-12 col-md-auto d-flex justify-content-center align-items-center gap-2 mb-3 mb-md-0">
                        <p class="m-0">Go to</p>
                        <input type="text" 
                        v-model.number="goToPagePageNumber"
                        @keyup.enter="goToPage"
                    
                        class=" text-center form-control shadow-none border-secondary border-opacity-50"  style="width: 50px;">
                    </div>

                    <div class="col-12 col-md-3  d-flex align-items-center justify-content-center mb-3 mb-md-0  mb-md-0">
                        <select class="form-select w-50 text-center shadow-none border-secondary border-opacity-50 fs-6" v-model="itemPerPage">
                            
                            <option :value="10">10/page</option>
                            <option :value="20">20/page</option>
                            <option :value="30">30/page</option>

                        </select>
                    
                    </div>

                
                </div>

                <div class="table-responsive m-5">
                    <div v-if="filteredStudents.length === 0" class=" text-danger fw-bold">No Student found</div>
                
                        <table v-else class="table table-hover table-light table-opacity-50 border-secondary border-opacity-25 ">
                            <thead class="align-middle">
                                <tr class="text-center align-middle ">
                                    <th>S.No</th>
                                    <th>Reg No</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                    <th>DOB</th>
                                    <th>Class</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                
                                </tr>
                            
                            </thead>

                            <tbody  >
                                <tr v-for="(student,index) in paginatedStudents" :key="student.id" class="text-center " >
                                    <td>{{ (currentPage-1) * itemPerPage +index+1 }}</td>
                                    <td >{{ student.regNo }}</td>
                                    <td>{{ student.user.name }}</td>
                                    <td class="text-primary fw-semibold">{{ student.user.email }}</td>
                                    <td>{{ student.gender }}</td>
                                    <td>{{ formatDate(student.dob) }}</td>
                                    <td>{{ student.class.standard.name }}-{{ student.class.name }}</td>
                                    <td>{{ student.phone }}</td>
                                    <td class="text-start">{{ student.addressLine1 }},<br>
                                        {{ student.addressLine2 }},<br>
                                        {{ student.city }},
                                        {{ student.state }}</td>

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
                                    @click="showImportResult = false">
                                </button>    
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

    import AdminNavbar from "../../components/AdminNavbar.vue";
    import {ref,onMounted, computed,watch} from 'vue';
    import {useRouter} from 'vue-router'
    import API from "../../services/api.js";

    const router = useRouter();

    const students = ref([]);

    const selectedClassName = ref("All classes");
    const selectedClassId = ref("");
    const classes = ref([]);

    const getClass = async()=>{
        try{
            const token = localStorage.getItem("token");

            const res = await API.get("/api/classes",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            classes.value = res.data;

        }catch(err){
            console.log("Error Fetching Classes",err)
        }
    }

    onMounted(getClass);

    const selectClass = (classId,className) =>{
        selectedClassId.value = classId;
        selectedClassName.value = className;
        currentPage.value = 1;
        search.value = "";
        goToPagePageNumber.value = "";

    }

    const  getStudents = async() =>{

        try{
            const token = localStorage.getItem("token");
            
            const res = await API.get("/api/students",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            
            })
            students.value= res.data  
        }catch(err){
        console.log("Error Fetching Students ",err)
        }
    }
    onMounted(getStudents);
    

    const formatDate = (date) =>{
        if(!date) return "";
        const newdate = new Date(date);
        return newdate.toLocaleDateString('en-GB')  //format date
    }


    // search functionality
    const search = ref("")
    const filteredStudents = computed(()=>{

        let result = students.value;

        if(selectedClassId.value !== ""){
            result = result.filter(student =>
               String(student.class.id) === String(selectedClassId.value)
            )
        }

        if(search.value.trim() !== ""){
            const keyword = search.value.toLowerCase();

            result = result.filter(student=>{
                return(
                    student.regNo.toLowerCase().includes(keyword) ||
                    student.user.name.toLowerCase().includes(keyword)||
                    student.user.email.toLowerCase().includes(keyword)

            )
        });
      
        }

        return result;
              
    })

    watch(search,()=>{
    currentPage.value=1
    goToPagePageNumber.value=""
    })


    //deletestudents

    const deleteStudent = async(stdId) => {
        const confirmDelete = confirm("Are you sure you want to delete this student?" )

        if(!confirmDelete){
            return
        }
        try{
            const token = localStorage.getItem("token");
            const res= await API.delete(`/api/students/${stdId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
        
            })

            alert(res.data.message)
            await getStudents();   
            
            if (currentPage.value > totalPages.value) {
                currentPage.value = Math.max(1, totalPages.value);
            }
        }
        catch(err){
            alert(err.response.data.error)
        }

    }


    // pagination

    const currentPage = ref(1);
    const itemPerPage = ref(10);

    const totalPages = computed(() => {
        return Math.ceil(filteredStudents.value.length/itemPerPage.value)
    })


    const paginatedStudents = computed(() => {
        const start = (currentPage.value-1)*(itemPerPage.value)
        const end = start+itemPerPage.value;
 
        return filteredStudents.value.slice(start,end)
    })


    const nextpage = () => {
        if(currentPage.value<totalPages.value){
            currentPage.value++;
            goToPagePageNumber.value = "";
        }
    }

    const previousPage = () => {
        if(currentPage.value > 1){
            currentPage.value--;
            goToPagePageNumber.value = "";
        }
    }

    const goToPagePageNumber = ref("")
    const goToPage = () => {
        if(goToPagePageNumber.value >= 1 && goToPagePageNumber.value <= totalPages.value){
            currentPage.value=goToPagePageNumber.value
        }
    }

    watch(itemPerPage,()=>{
    currentPage.value =1;
    goToPagePageNumber.value=""
})

//csv file
    const fileInput = ref(null);
    const importResult = ref(null);
    const showImportResult = ref(false);

  
    const uploading = ref(false)
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

        const res = await API.post("/api/students/upload",formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        uploading.value = false;
        importResult.value = res.data;
        showImportResult.value = true;

        await getStudents();
        }
        
       catch(err){
        uploading.value = false;
  
    alert(err.response?.data?.message || "CSV upload failed");
       }
         

    }

    const totalStudents = computed(() => students.value.length)

    </script>

<style scoped>
table th{
    font-size: 14px;
}

table td{
    font-size: 12px;
}
</style>