        <template>
        <AdminNavbar>

        <div class="container">

        <div class="m-5 row">

        <h1 class="text-danger text-center fw-bold  mb-3 ">Create Timetable</h1>

    <div class="d-flex flex-sm-column justify-content-center align-items-center gap-4 mt-5 ">
    <select v-model="timetable.class_id" class="form-select w-25" >
        <option value="" disabled>Select Class</option>
        <option  v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.standard_name }} - {{ cls.class_name }}</option>
        </select>

        <select v-model="timetable.day" class="form-select w-25">
        <option value="" disabled>Select Day</option>
        <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>

    </div>
    
    <div class="w-100 d-flex flex-column justify-content-center align-items-center">
    <table class="table table-bordered mt-5  text-center mx-5 w-75 ">
            
        
            <thead class="table-light">
            <tr>
        
            <th>Period</th>
            <th>Time</th>
            <th>Subject</th>
                </tr>
            </thead>

            <tbody>
            <tr v-for="period in periods" :key="period.id">
            <td  >{{ period.period_no }}</td>
            <td>{{ period.start_time.slice(0,5) }} - {{ period.end_time.slice(0,5) }}</td>
            <td >
            <select v-model="period.subject_id" >
            <option value="" disabled>Select Subject</option>
            <option v-for="sub in subjects" :key="sub.id" :value="sub.id" >{{ sub.subject_name }}</option>
            </select>
            </td>
            </tr>
            
            </tbody>
            </table>
    <div class="d-flex gap-3 my-3">
    <button class="btn btn-outline-success px-4 fw-bold" @click="saveTimetable()">Save</button>
            <button class="btn btn-outline-secondary px-4 fw-bold" @click="router.push('/timetablelist')">Cancel</button>

    </div>
        
    </div>
            
        </div>

        </div>



        </AdminNavbar>
            </template>


            <script setup>
            
            import AdminNavbar from '../../components/AdminNavbar.vue';
            import {ref,onMounted} from 'vue';
            import {useRouter} from 'vue-router';
        import API from '../../services/api.js';

            const router = useRouter();

            const classes = ref([])

            const getClass = async() =>{
                try{
                    const token = localStorage.getItem("token");

                    const res = await API.get("/api/classes",{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    })
                    classes.value = res.data
                
                }catch(err){
                    console.log(err)
                }
            }
            onMounted(getClass);

            const days = ref(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]);
        

            const subjects = ref([]);
            const getSubjects = async() =>{
                try{
                    const token = localStorage.getItem("token");

                    const res = await API.get("/api/subjects",{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    })
                    subjects.value = res.data
                }catch(err){
                    console.log(err)
                }
            } 
            onMounted(getSubjects)

            const periods = ref([]);

            const getPeriods = async() =>{
                try{
                    const token = localStorage.getItem("token");

                    const res = await API.get("/api/periods",{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    })
                    periods.value = res.data
                    periods.value= periods.value.map(period =>({
                        ...period,
                        subject_id:""
                    }))

                }catch(err){
                    
                    console.log(err)
                }
            }
            onMounted(getPeriods)

            const timetable =ref({
                class_id:"",
                day:""
                
            })


    const saveTimetable = async()=>{
        if (!timetable.value.class_id || !timetable.value.day) {
            alert("Please select class and day");
            return;
        }
        for (const period of periods.value) {
            if (!period.subject_id) {
                alert(`Please select subject for Period ${period.period_no}`);
                return;
            }
        }

    try{
        const token = localStorage.getItem("token");
    let inserted=0
    let response=""
        for(const period of periods.value){
        
            const res = await API.post("/api/timetable",{
                class_id:timetable.value.class_id,
                day:timetable.value.day,
                period_id:period.id,
                subject_id:period.subject_id
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            inserted+=1
        response=res.data
        }
        if(inserted === periods.value.length){
            alert(response);
               timetable.value = {
        class_id: "",
        day: ""
    };

    periods.value = periods.value.map(period => ({
        ...period,
        subject_id: ""
    }));
        }
    }catch(err){
        alert(err.response.data)
    }
    
    }
        
            </script>