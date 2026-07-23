

        <template>

            <AdminNavbar>
            <div class="container">
                <div class="text-center py-5 d-flex ms-5 justify-content-center align-items-center gap-5">
                <button class="btn btn-outline-secondary" @click="router.push('/timetablelist')">Back</button>
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
                <td>{{ tt.period_no }}</td>
                <td>{{ tt.start_time.slice(0,5)}}-{{ tt.end_time.slice(0,5) }}</td>
                <td>
                <select v-model="tt.subject_id">
               
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.subject_name }}</option>
                </select>
                </td>

                </tr>
                </tbody>
                </table>
                
                <div class="d-flex justify-content-center align-items-center my-5 gap-3">
                <button class="btn btn-outline-danger fw-bold px-4" @click="updateTimetable()">Update</button>
                <button class="btn btn-outline-secondary fw-bold px-4" @click="router.push('/timetablelist')">Cancel</button>
                
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
                timetable.value=res.data
                
            
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
                let updated= 0
                for(const tt of timetable.value){
                    const res = await API.put('/api/timetable',{
                            class_id: tt.class_id,
                            period_id: tt.period_id,
                            day: tt.day,
                            subject_id: tt.subject_id
                    },
                    {headers:{
                        Authorization:`Bearer ${token}`
                    }})
                    updated+=1
                }
if(updated === timetable.value.length){
    alert("Updated Successfully");
    router.push('/timetablelist')
}
            }catch(err){
                alert(err.response.data)
            }
        }
    </script>