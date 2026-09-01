        <template>
        <AdminNavbar>

        <div class="container">

        <div class="m-5 row">

        <h1 class="text-danger text-center fw-bold  mb-3 ">Create Timetable</h1>

    <div class="d-flex flex-sm-column justify-content-center align-items-center gap-4 mt-5 ">
    <select v-model="timetable.class_id" class="form-select w-25" required>
        <option value="" disabled>Select Class</option>
        <option  v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.standard.name }} - {{ cls.name }}</option>
        </select>



    </div>
   
    <div  class="w-100 d-flex flex-column justify-content-center align-items-center">
    <table  class="table table-bordered text-center timetable-table mt-5">
            
        
            <thead class="table-light">
            <tr class="text-center align-middle">
        
            <th>Day/Period</th>
            <th v-for="period in periods" :key="period.id">
                <div>{{ period.periodNo }}</div>

                <small class="text-nowrap text-secondary">
                {{ period.startTime.slice(11,16) }}-{{ period.endTime.slice(11,16) }}
                </small>
            </th>
                </tr>
            </thead>

            <tbody>
    
             <tr v-for="day in days" :key="day">

                <td class="fw-bold">{{ day }}</td>
                
                <td v-for="period in periods" :key="period.id" >
                <select
    class="form-select subject-select"
    v-model="getSchedule(day, period.id).subject_id"
    @keydown.enter.prevent="moveToNext(day, period.id)"
   
>
    <option value="" disabled>Select subject</option>

    <option
        v-for="sub in subjects"
        :key="sub.id"
        :value="sub.id"
    >
        {{ sub.subjectName }}
    </option>
</select>
           
                </td>
             </tr>
            </tbody>
            </table>
    <div class="d-flex gap-3 my-3">
    <button class="btn btn-outline-success px-4 fw-bold" @click="saveTimetable()">Save</button>
            <button class="btn btn-outline-secondary px-4 fw-bold" @click="router.push('/timetable/list')">Cancel</button>

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
            const timetable =ref({
                class_id:"",
                schedule:[]
                
            })


            const getPeriods = async() =>{
                try{
                    const token = localStorage.getItem("token");

                    const res = await API.get("/api/periods",{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    })
                    periods.value = res.data
                    timetable.value.schedule=[]

                    for(const day of days.value){
                        for(const period of periods.value){
                            timetable.value.schedule.push({
                                day:day,
                                period_id:period.id,
                                subject_id:""
                            })
                        }
                    }


                }catch(err){
                    
                    console.log(err)
                }
            }
            onMounted(getPeriods)

         
const getSchedule = (day, periodId) => {
    return timetable.value.schedule.find(item =>
        item.day === day && item.period_id === periodId
    );
};
    const saveTimetable = async()=>{
     
    if(!timetable.value.class_id){
        alert("Please select class");
        return
    };

    const emptySubject = timetable.value.schedule.some(item => !item.subject_id);

    if(emptySubject){
        alert("Please select subject for all periods");
        return;
    }

   

    try{
        const token = localStorage.getItem("token");

        const res=await API.post("/api/timetable",{
            class_id:timetable.value.class_id,
            timetable:timetable.value.schedule
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        alert(res.data.message);
        router.push('/timetable/list')
    }catch(error){
        alert(error.response.data.error)
    }

    }
const moveToNext = (day, periodId) => {

    const currentIndex = timetable.value.schedule.findIndex(item =>
        item.day === day && item.period_id === periodId
    );

    const nextIndex = currentIndex + 1;

    const selects = document.querySelectorAll(".subject-select");

    if (nextIndex < selects.length) {
        selects[nextIndex].focus();
    }

};
        
</script>

<style scoped>
.timetable-table {
    width: 100%;
    table-layout: fixed;
}

.timetable-table th,
.timetable-table td {
    padding: 6px 4px;
    vertical-align: middle;
}


.timetable-table td:first-child {
    width: 80px;
}

.subject-select {
    width: 100%;
    min-width: 0;
    font-size: 13px;
}
</style>