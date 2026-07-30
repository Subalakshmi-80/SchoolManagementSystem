    <template>

    <AdminNavbar>
            <div>
                <div class="sm-row p-0 m-0 p-md-5 d-md-flex align-items-center" >

                    <div class="col-12  col-md-6 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
                        <button class="btn btn-success fw-bold" @click="router.push('/student/create')">+ Add Student</button>
                        
                    </div>
                
                    <div class="d-flex col-12 col-md-6 justify-content-center justify-content-md-end mb-3 mb-md-0" >

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
                    <p class="bg-success p-1 px-2 h-25 m-0 text-white fw-bold">{{ currentPage }}</p>
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
                    
                    <option value="10">10/page</option>
                    <option value="20">20/page</option>
                    <option value="30">30/page</option>

                    </select>
                    
                    </div>

                
                </div>

                <div class="table-responsive m-5">
                <table class="table  align-middle table-light table-opacity-50 border-secondary border-opacity-25 ">
                    <thead class="align-middle">
                        <tr>
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
                    <tr v-for="student in paginatedStudents" :key="student.id" >
                    <td >{{ student.regno }}</td>
                    <td>{{ student.name }}</td>
                    <td class="text-primary fw-semibold">{{ student.email }}</td>
                    <td>{{ student.gender }}</td>
                    <td>{{ formatDate(student.dob) }}</td>
                    <td>{{ student.class_name }}</td>
                    <td>{{ student.phone }}</td>
                    <td >{{ student.address_line1 }},<br>
                    {{ student.address_line2 }},<br>
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

            
            </div>

    </AdminNavbar>
        
    </template>


    <script setup>

    import AdminNavbar from "../../components/AdminNavbar.vue";


    import axios from "axios";
    import {ref,onMounted, computed,watch} from 'vue';
    import {useRouter} from 'vue-router'
    import API from "../../services/api.js"

    const router = useRouter();

    const students = ref([]);

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
        if(!search.value.trim()){
            return students.value
        }

        const keyword = search.value.toLowerCase();
        return students.value.filter(student=>
            
            student.regno.toLowerCase().includes(keyword) ||
            student.name.toLowerCase().includes(keyword) ||
            student.class_name.toLowerCase().includes(keyword)
        )
    })

watch(search,()=>{
currentPage.value=1
})

    //deletestudents

    const deleteStudent = async(stdId) => {
        try{
            const token = localStorage.getItem("token");
        const res= await API.delete(`/api/students/${stdId}`,{
                headers:{
                Authorization:`Bearer ${token}`
            }
        
            })

            alert(`Student data deleted successfully`)
            await getStudents();        
        }
        catch(err){
            console.log("Error Deleting Data",err)
        }

    }


    // pagination

    const currentPage = ref(1);
    const itemPerPage = ref(10)

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
            currentPage.value++
        }
    }

    const previousPage = () => {
        if(currentPage.value>1){
            currentPage.value--;
        }
    }

    const goToPagePageNumber = ref("")
    const goToPage = () => {
        if(goToPagePageNumber.value >= 1 && goToPagePageNumber.value<=totalPages.value){
            currentPage.value=goToPagePageNumber.value
        }
    }
    </script>

