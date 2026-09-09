

        <template>

            <AdminNavbar>
            <div class="container">
                <div class="text-center py-5 d-flex ms-5 justify-content-center align-items-center gap-5">
                <button class="btn btn-outline-secondary" @click="router.push('/timetable/list')">Back</button>
                <h1 class="text-danger fw-bold">Edit Timetable</h1>
                </div>

                <p v-if="timetable.length===0" class="text-danger text-center fw-bold my-3 fs-4">No Timetable Found</p>
                <div v-else class=" d-flex justify-content-center align-items-center flex-column">
                 <p class="text-success fw-bold fs-4">{{timetable[0].class.standard.name}}-{{ timetable[0].class.name }} Timetable</p>
                <table class="table table-bordered  text-center table-hover timetable-table mt-5">
                <thead class="table-light">
                <tr class="text-center align-middle">
                <th>Day/Period</th>
                <th v-for="period in periods">
                    <div>{{ period.periodNo }}</div>
                    <small class="text-nowrap text-secondary">{{ period.startTime.slice(11,16) }}-{{ period.endTime.slice(11,16) }}</small>
                </th>
                </tr>
                </thead>

                <tbody>
          
               <tr v-for="day in days" :key="day">
                <td class="fw-bold">{{ day }}</td>
               <td v-for="period in periods" :key="period.id">
                <select v-if="getSchedule(day,period.id)"
                class="form-select subject-select"
                v-model="getSchedule(day,period.id).subjectId"
                @keydown.enter.prevent="moveToNext(day,period.id)"
                >
                    <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.subjectName }}</option>
                    
                
                </select>

                  <span v-else>-</span>
               </td>
               </tr>
                </tbody>
                </table>
                
                <div class="d-flex justify-content-center align-items-center my-5 gap-3">
                <button class="btn btn-outline-danger fw-bold px-4" @click="updateTimetable()">Update</button>
                <button class="btn btn-outline-secondary fw-bold px-4" @click="router.push('/timetable/list')">Cancel</button>
                
                </div>
                </div>

                
            </div>
            
            </AdminNavbar>
        </template>


        <script setup>

        import AdminNavbar from '../../components/AdminNavbar.vue';
        import {ref,onMounted} from 'vue';
        import API from '../../services/api.js';
        import { useRoute ,useRouter} from 'vue-router';

        const route = useRoute();
        const router = useRouter();

        const clsId = route.params.id;
    
        const days = ref(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])
    
        const periods = ref([]);

        const getPeriods = async()=>{
            const token =  localStorage.getItem("token");

            const res= await API.get("/api/periods",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });

            periods.value=res.data
        }

        onMounted(getPeriods)
        const timetable = ref([]);

        const getTimetable = async() =>{
            try{
                const token = localStorage.getItem("token");
                const res = await API.get(`/api/timetable/class/${clsId}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                timetable.value=res.data;
              
     
            }catch(err){
                console.log(err)
            }
        }
        onMounted(getTimetable);

        const subjects = ref([]);

        const getSubject = async() =>{
            try{
                const token = localStorage.getItem("token");

                const res = await API.get("/api/subjects",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                subjects.value=res.data;
             
            }catch(err){
                console.log(err)
            }
        }
    

        onMounted(getSubject);

        const getSchedule = (day,periodId)=>{
            return timetable.value.find(tt =>{
                return tt.day===day && tt.periodId === periodId
            })

            
        }

        const updateTimetable = async()=>{
            try{
                const token = localStorage.getItem("token");
               
                const timetableData = timetable.value.map(tt=>({
                    day:tt.day,
                    period_id:tt.periodId,
                    subject_id:tt.subjectId

                }))

                const res = await API.put("/api/timetable",{
                    class_id:clsId,
                    timetable:timetableData
                },{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                alert(res.data.message);
                router.push("/timetable/list")
            }catch(err){
                alert(err.response.data.error)
            }
        }


const moveToNext = () => {
    const selects = document.querySelectorAll(".subject-select");

    const currentIndex = Array.from(selects).indexOf(document.activeElement);

    if (currentIndex < selects.length - 1) {
        selects[currentIndex + 1].focus();
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