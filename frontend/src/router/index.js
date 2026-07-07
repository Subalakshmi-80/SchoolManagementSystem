import {createRouter,createWebHistory} from "vue-router";

import Login from "../views/Login.vue"
import Admin from "../views/admin-dashboard.vue";
import Student from "../views/student-dashboard.vue";
import studentList from "../views/Studentlist.vue";
import addStudent from "../views/addStudent.vue";
import editStudent from "../views/editStudent.vue";

const routes =[
{path:"/",component:Login},
{path:"/admin",component:Admin,meta:{role:"admin"}},
{path:"/student",component:Student,meta:{role:"student"}},
{path:"/studentlist",component:studentList,meta:{role:"admin"}},
{path:"/student/create",component:addStudent,meta:{role:"admin"}},
{path:'/student/edit/:id',component:editStudent,meta:{role:"admin"}}
]

const router = createRouter({
    history:createWebHistory(),
    routes});
    

    router.beforeEach((to,from,next) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const requiredRole = to.meta.role;

    if(to.path === "/"){
        next()
    }
    else if(!token){
        next("/")
    }

    else if(requiredRole === role){
        next()
    }
    else{
        next("/")
    }
  
    });

export default router;