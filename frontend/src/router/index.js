import {createRouter,createWebHistory} from "vue-router";

import Login from "../views/Login.vue";
import forgotPassword from "../views/forgot-password.vue";
import otpVerification from "../views/otpVerification.vue";
import resetPassword from "../views/resetPassword.vue";
import Admin from "../views/admin-dashboard.vue";
import Teacher from "../views/teacher-dashboard.vue"
import Student from "../views/student-dashboard.vue";
import studentList from "../views/StudentList.vue";
import addStudent from "../views/addStudent.vue";
import editStudent from "../views/editStudent.vue";
import standardList from "../views/StandardList.vue";
import addStandard from "../views/addStandard.vue";
import editStandard from "../views/editStandard.vue"
import ClassList from "../views/classes/classList.vue";
import addClass from "../views/classes/addClass.vue";
import editClass from "../views/classes/editClass.vue";
import SubjectList from "../views/subjects/subjectList.vue";
import AddSubject from "../views/subjects/addSubject.vue";
import editSubject from "../views/subjects/editSubject.vue";
import TestList from "../views/Tests/testList.vue";
import AddTest from "../views/Tests/addTest.vue";
import EditTest from "../views/Tests/editTest.vue";
import EnterMarks from "../views/Tests/addMarks.vue";
import viewMarks from "../views/Tests/viewMarks.vue";
import editMarks from "../views/Tests/editMarks.vue";
import FeesDashboard from "../views/Fees/feesDashboard.vue";
import FeesCollect from "../views/Fees/collectFee.vue"

const routes =[
{path:"/",component:Login},
{path:"/forgot-password",component:forgotPassword},
{path:"/otp-verification",component:otpVerification},
{path:"/reset-password",component:resetPassword},
{path:"/student",component:Student,meta:{role:"student"}},
{path:"/admin",component:Admin,meta:{role:"admin"}},
{path:"/teacher",component:Teacher,meta:{role:"teacher"}},
{path:"/studentlist",component:studentList,meta:{role:"admin"}},
{path:"/student/create",component:addStudent,meta:{role:"admin"}},
{path:'/student/edit/:id',component:editStudent,meta:{role:"admin"}},
{path:'/standardlist',component:standardList,meta:{role:"admin"}},
{path:'/standard/create',component:addStandard,meta:{role:"admin"}},
{path:'/standard/edit/:id',component:editStandard,meta:{role:"admin"}},
{path:'/classlist',component:ClassList,meta:{role:"admin"}},
{path:'/class/create',component:addClass,meta:{role:"admin"}},
{path:'/class/edit/:id',component:editClass,meta:{role:"admin"}},
{path:'/subjectlist',component:SubjectList,meta:{role:"admin"}},
{path:'/subject/create',component:AddSubject,meta:{role:"admin"}},
{path:'/subject/edit/:id',component:editSubject,meta:{role:"admin"}},
{path:'/testlist',component:TestList,meta:{role:"teacher"}},
{path:'/test/create',component:AddTest,meta:{role:"teacher"}},
{path:'/test/edit/:id',component:EditTest,meta:{role:"teacher"}},
{path:'/test/enterMarks/:id',component:EnterMarks,meta:{role:"teacher"}},
{path:'/test/viewMarks/:id',component:viewMarks,meta:{role:"teacher"}},
{path:'/test/editMarks/:id',component:editMarks,meta:{role:"teacher"}},
{path:'/feesDashboard',component:FeesDashboard,meta:{role:'admin'}},
{path:'/fees/collect',component:FeesCollect,meta:{role:'admin'}}
]

const router = createRouter({
    history:createWebHistory(),
    routes});
    

    router.beforeEach((to,from,next) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const requiredRole = to.meta.role;

    if(to.path === "/" || to.path === "/forgot-password" || to.path === "/otp-verification" || to.path === "/reset-password"){
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