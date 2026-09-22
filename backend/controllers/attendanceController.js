const prisma = require("../prisma/prisma");

const markAttendance = async(req,res)=>{

    try{
    const {class_id,date,attendance}= req.body;

    if(!class_id || !date || !attendance ){
        return res.status(422).json({
            error:"Class, date and attendance are required."
        })
    }

    const classId = Number(class_id);
    const attendanceDate = new Date(date);


    if(!Number.isInteger(classId)){
        return res.status(422).json({
            error:"Invalid class"
        })
    }

    if(isNaN(attendanceDate.getTime())){
        return res.status(422).json({
            error:"Invalid date"
        })
    }

   //check teacher permission

   if(req.user.role === "teacher"){
        
        const teacher = await prisma.teacher.findUnique({
            where:{
                userId:req.user.id
            }
        });

        if(!teacher){
            return res.status(404).json({error:"Teacher not found."})
        }

        if(teacher.classIncharge !== "Yes"){
            return res.status(400).json({
                error:"You are not assigned as a class incharge."
            })
        }

        const selectedClass = await prisma.class.findUnique({
            where:{
                id:classId
            },
            include:{
                standard:true
            }
        });

        if(!selectedClass){
            return res.status(404).json({error:"Class not found."})
        }

        const selectedClassName = `${selectedClass.standard.name} - ${selectedClass.class.name}`;

        if(teacher.classSection !== selectedClassName){
            return res.status(403).json({
                error:"You can mark attendance only for your assigned class."
            })
        }

        
   }

   const calendar = await prisma.schoolCalendar.findUnique({
    where:{
        date:attendanceDate
    }
   })

   if(calendar){
    return res.status(400).json({
        error: calendar.type === "HOLIDAY" 
            ? `Attendance cannot be marked. It is a holiday ${calendar.reason? `:${calendar.reason}`:""}.`
            :"Attendance cannot be marked. It is a weekly off."
    })
   }

   if(attendanceDate.getUTCDay() === 0){
    return res.status(400).json({
        error:"Attendance cannot be marked. Sunday is a weekly off."
    })
   }

   const students = await prisma.student.findMany({
    where:{
        classId:classId
    }
   })

   if(students.length === 0){
    return res.status(404).json({error:"No students found in this class.    "})
   }

   //check attendance students

   for(const item of attendance){
        const student = students.find(
            student => student.id === Number(item.student_id)
        );

        if(!student){
            return res.status(400).json({error:"Invalid student for this class."})
        }

        if(!["PRESENT","ABSENT"].includes(item.status)){
            return res.status(400).json({error:"Invalid attendance status."})
        }

        const existingAttendance = await prisma.attendance.findMany({
            where:{
                studentId:{
                    in: attendance.map(item => Number(item.student_id))
                },
                date:attendanceDate
            }
        });

        if(existingAttendance.length>0){
        return res.status(400).json({error:"Attendance already marked for this date"})
        }

        await prisma.$transaction(async (tx)=>{
            await tx.attendance.createMany({
                data:attendance.map(item =>({
                    studentId:Number(item.student_id),
                    date:attendanceDate,
                    status:item.status,
                    markedBy:req.user.id
                }))
            })
        })

        return res.status(201).json({message:"Attendance marked successfully."})
   }
}catch(error){
    console.log(error);
    return res.status(500).json({
        error:"Something went wrong while marking attendance."
    })
}
}

module.exports = {markAttendance}