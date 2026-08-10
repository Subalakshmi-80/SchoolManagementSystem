

        <template>

            <AdminNavbar>
            <div class="container">
                <div class="text-center py-5 d-flex ms-5 justify-content-center align-items-center gap-5">
                <button class="btn btn-outline-secondary" @click="router.push('/timetable/list')">Back</button>
                <h1 class="text-danger fw-bold">Edit Timetable</h1>
                </div>

                <p v-if="timetable.length===0" class="text-danger text-center fw-bold my-3 fs-4">No Timetable Found</p>
                <div v-else class="m-5 d-flex justify-content-center align-items-center flex-column">
                <table class="table table-bordered w-75 text-center table-hover">
                <thead class="table-light">
                <tr>
                <th>Period</th>
                <th>Time</th>
                <th>Subject</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="tt in timetable" :key="tt.id">
                <td>{{ tt.period.periodNo }}</td>
                <td>{{ tt.period.startTime.slice(11,16)}}-{{ tt.period.endTime.slice(11,16) }}</td>
                <td>
                <select v-model="tt.subjectId">
               
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.subjectName }}</option>
                </select>
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
        const day=route.query.day
        
    
        const timetable = ref([]);

        const getTimetable = async() =>{
            try{
                const token = localStorage.getItem("token");
                const res = await API.get(`/api/timetable/class/${clsId}?day=${day}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                timetable.value=res.data;
                console.log(timetable.value)
                
            
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

        const updateTimetable = async()=>{
            try{
                const token = localStorage.getItem("token");
                let updated= 0;
                let response = "";

                for(const tt of timetable.value){
                    const res = await API.put('/api/timetable',{
                            classId: tt.classId,
                            periodId: tt.periodId,
                            day: tt.day,
                            subjectId: tt.subjectId
                    },
                    {headers:{
                        Authorization:`Bearer ${token}`
                    }})
                    updated+=1
                    response = res.data.message
                }
if(updated === timetable.value.length){
    alert(response);
    router.push('/timetable/list')
}
            }catch(err){
                alert(err.response.data.error)
            }
        }
    </script>