    <template>
    <AdminNavbar>

    <div class="container">
    <div class="d-flex my-5 justify-content-around align-items-center">
    <h1 class="fw-bold text-danger">Timetable</h1>
    <button class="btn btn-success px-4 py-2 fw-bold " @click="router.push('/timetable/create')">ADD </button>
    </div>

    <div class="d-flex  justify-content-center align-items-center gap-4 mt-5 ">
        <select v-model="getTimetableByClass.class_id" class="form-select w-25 ">
            <option value="" disabled>Select Class</option>
            <option  v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.standard.name }} - {{ cls.name }}</option>
            </select>

        
    <button class="btn  btn-outline-primary px-4 fw-bold " @click="getTimetable()">view</button>
    <button class="btn btn-outline-secondary px-4 fw-bold" @click="editTimetable()">Edit</button>
        </div>
    <div v-if="searched && timetable.length ===0" class="text-center py-5 text-danger fs-2 fw-bold">  No timetable found</div>

    <div v-else-if="timetable.length > 0" class="w-100 d-flex flex-column justify-content-center align-items-center my-5" >
        <p class="text-success fw-bold fs-4">{{timetable[0].class.standard.name}}-{{ timetable[0].class.name }} Timetable</p>
    <table class="table table-bordered w-75 table-hover ">
            <thead class="table-light">
            <tr class="text-center align-middle">
            <th>Day/period</th>
           <th v-for="period in periods" :key="period.id">
            <div>Period {{ period.periodNo }}</div>
            <small class="text-nowrap text-secondary">
                {{ period.startTime.slice(11,16) }}-{{ period.endTime.slice(11,16) }}
            </small>
          
           </th>
            </tr>
            
            </thead>

            <tbody>

                <tr v-for="day in days" class="fw-bold text-center align-middle">
                    <td>{{ day }}</td>

                    <td v-for="period in periods" :key="period.id" class="fw-normal">

                    {{ getSubjects(day,period.id) }}
                    </td>
                </tr>

               
            </tbody>
            </table>
    </div>

    </div>

    </AdminNavbar>
        </template>


        <script setup>
        
        import AdminNavbar from '../../components/AdminNavbar.vue';
        import {useRouter} from 'vue-router';
        import {ref,onMounted,computed} from 'vue';
        import API from '../../services/api.js';
    import EditTimetable from './editTimetable.vue';

        const router = useRouter();

        const classes = ref([]);
        const searched = ref(false)
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

        const getTimetableByClass= ref({
            class_id:"",
            
        })
        const timetable = ref([]);

        const periods = computed(()=>{
            const uniquePeriods = [];

            timetable.value.forEach(tt=>{
                if(!uniquePeriods.find(p => p.id === tt.period.id)){
                    uniquePeriods.push(tt.period)
                }
            });

            return uniquePeriods.sort((a,b)=>a.periodNo - b.periodNo)
        })


        const getTimetable = async() =>{

            if(!getTimetableByClass.value.class_id ){
                alert("Please Select Class");
                return;
            }
            try{
                const token = localStorage.getItem("token");

                const res = await API.get(`/api/timetable/class/${getTimetableByClass.value.class_id}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                timetable.value=res.data;
                searched.value=true;
  
    
        
            }catch(err){
                alert(err.response.data.error)
            }
        }


        const getSubjects = (day,periodId)=>{
            const result = timetable.value.find(tt=>
                day===tt.day && periodId === tt.periodId
            )
            
            return result ? result.subject.subjectName : '-';
        }


    const editTimetable = () =>{
        if(!getTimetableByClass.value.class_id ){
                alert("Please Select Class");
                return;
            }
            router.push(`/timetable/edit/${getTimetableByClass.value.class_id}`)
    }
    
        </script>