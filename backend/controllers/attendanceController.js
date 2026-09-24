const prisma = require("../prisma/prisma");


const markAttendance = async(req,res)=>{

    try{
        const {class_id,date,attendance,academicYearId} = req.body;

        if(!class_id || !date || !attendance){
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

        // Get Academic Year
        let selectedAcademicYear;

        if(academicYearId){

            selectedAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id:Number(academicYearId)
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Academic Year not found."
                })
            }

        }else{

            selectedAcademicYear = await prisma.academicYear.findFirst({
                where:{
                    isActive:true
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Active Academic Year not found."
                })
            }
        }

        // Check whether attendance date is within Academic Year
        if(
            attendanceDate < selectedAcademicYear.startDate ||
            attendanceDate > selectedAcademicYear.endDate
        ){
            return res.status(422).json({
                error:"Attendance date must be within the selected Academic Year."
            })
        }

        // check teacher permission

        if(req.user.role === "teacher"){

            const teacher = await prisma.teacher.findUnique({
                where:{
                    userId:req.user.id
                }
            });

            if(!teacher){
                return res.status(404).json({
                    error:"Teacher not found."
                })
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
                return res.status(404).json({
                    error:"Class not found."
                })
            }

            const selectedClassName =
                `${selectedClass.standard.name}-${selectedClass.name}`;

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
        });

        if(calendar){
            return res.status(400).json({
                error: calendar.type === "HOLIDAY"
                    ? `Attendance cannot be marked. It is a holiday ${calendar.reason ? `:${calendar.reason}` : ""}.`
                    : "Attendance cannot be marked. It is a weekly off."
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
        });

        if(students.length === 0){
            return res.status(404).json({
                error:"No students found in this class."
            })
        }

        // Check attendance students

        for(const item of attendance){

            const student = students.find(
                student => student.id === Number(item.student_id)
            );

            if(!student){
                return res.status(400).json({
                    error:"Invalid student for this class."
                })
            }

            if(!["PRESENT","ABSENT"].includes(item.status)){
                return res.status(400).json({
                    error:"Invalid attendance status."
                })
            }
        }

        // Check whether attendance is already marked

        const existingAttendance = await prisma.attendance.findMany({
            where:{
                studentId:{
                    in:attendance.map(item => Number(item.student_id))
                },
                date:attendanceDate
            }
        });

        if(existingAttendance.length > 0){
            return res.status(400).json({
                error:"Attendance already marked for this date"
            })
        }

        await prisma.$transaction(async(tx)=>{

            await tx.attendance.createMany({
                data:attendance.map(item=>({
                    studentId:Number(item.student_id),
                    academicYearId:selectedAcademicYear.id,
                    date:attendanceDate,
                    status:item.status,
                    markedBy:req.user.id
                }))
            })

        })

        return res.status(201).json({
            message:"Attendance marked successfully."
        })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            error:"Something went wrong while marking attendance."
        })
    }
}

const getAttendance = async(req,res)=>{

    const { class_id,date,academicYearId } = req.query;

    if(!class_id || !date){
        return res.status(422).json({
            error:"Class and date are required."
        })
    }

    const classId = Number(class_id);
    const attendanceDate = new Date(date);

    if(!Number.isInteger(classId)){
        return res.status(422).json({
            error:"Invalid class."
        })
    }

    if(isNaN(attendanceDate.getTime())){
        return res.status(422).json({
            error:"Invalid date."
        })
    }

    try{
        let selectedAcademicYear;

        if(academicYearId){

            selectedAcademicYear =
                await prisma.academicYear.findUnique({
                    where:{
                        id:Number(academicYearId)
                    }
                });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Academic Year not found."
                })
            }

        }else{

            selectedAcademicYear =
                await prisma.academicYear.findFirst({
                    where:{
                        isActive:true
                    }
                });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Active Academic Year not found."
                })
            }

        }
        const selectedClass =
            await prisma.class.findUnique({
                where:{
                    id:classId
                },
                include:{
                    standard:true
                }
            });

        if(!selectedClass){
            return res.status(404).json({
                error:"Class not found."
            })
        }

        if(req.user.role === "teacher"){

            const teacher =
                await prisma.teacher.findUnique({
                    where:{
                        userId:req.user.id
                    }
                });

            if(!teacher){
                return res.status(404).json({
                    error:"Teacher not found."
                })
            }

            if(teacher.classIncharge !== "Yes"){
                return res.status(403).json({
                    error:"You are not assigned as a class incharge."
                })
            }

            const selectedClassName =
                `${selectedClass.standard.name}-${selectedClass.name}`;

            if(selectedClassName !== teacher.classSection){
                return res.status(403).json({
                    error:"You can view attendance only for your assigned class."
                })
            }

        }
        const students =
            await prisma.student.findMany({
                where:{
                    classId:classId
                },
                include:{
                    user:true,
                },
                orderBy:{
                    regNo:"asc"
                }
            });

        if(students.length === 0){
            return res.status(404).json({
                error:"No students found in this class."
            })
        }

        const attendanceRecords =
            await prisma.attendance.findMany({
                where:{
                    date:attendanceDate,
                    academicYearId:selectedAcademicYear.id,
                    studentId:{
                        in:students.map(
                            student => student.id
                        )
                    }
                }
            });

        const result = students.map(student =>{

            const record =
                attendanceRecords.find(
                    attendance =>
                        attendance.studentId === student.id
                );

            return {

                studentId:student.id,
                name:student.user.name,
                regNo:student.regNo,
                status:
                    record? record.status: null

            }

        });


        return res.status(200).json({

            date:date,

            academicYear:{
                id:selectedAcademicYear.id,
                name:selectedAcademicYear.name
            },

            class:{
                id:selectedClass.id,
                name:selectedClass.name,
                standard:selectedClass.standard.name
            },

            students:result

        })

    }catch(error){

        console.log(error);

        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })

    }

}




const updateAttendance = async(req,res) =>{
    const {class_id,date,attendance,academicYearId} = req.body;

    if(!class_id || !date || !attendance){
        return res.status(422).json({
            error:"Class, date and attendance are required."
        })
    }

    const classId = Number(class_id);
    const attendanceDate = new Date(date);

    if(!Number.isInteger(classId)){
        return res.status(422).json({
            error:"Invalid class."
        })
    }

    if(isNaN(attendanceDate.getTime())){
        return res.status(422).json({
            error:"Invalid date."
        })
    }

    try{

        let selectedAcademicYear;

        if(academicYearId){

            selectedAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id:Number(academicYearId)
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Academic Year not found."
                })
            }

        }else{

            selectedAcademicYear = await prisma.academicYear.findFirst({
                where:{
                    isActive:true
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Active Academic Year not found."
                })
            }
        }
        if(
            attendanceDate < selectedAcademicYear.startDate ||
            attendanceDate > selectedAcademicYear.endDate
        ){
            return res.status(422).json({
                error:"Attendance date must be within the selected Academic Year."
            })
        }

        if(req.user.role === "teacher"){

            const teacher = await prisma.teacher.findUnique({
                where:{
                    userId:req.user.id
                }
            })

            if(!teacher){
                return res.status(404).json({
                    error:"Teacher not found."
                })
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
            })

            if(!selectedClass){
                return res.status(404).json({
                    error:"Class not found."
                })
            }

            const selectedClassName =
                `${selectedClass.standard.name}-${selectedClass.name}`;

            if(selectedClassName !== teacher.classSection){
                return res.status(403).json({
                    error:"You can update attendance only for your assigned class."
                })
            }
        }

        const existingAttendance = await prisma.attendance.findMany({
            where:{
                studentId:{
                    in:attendance.map(item => Number(item.student_id))
                },
                date:attendanceDate,
                academicYearId:selectedAcademicYear.id
            }
        })

        if(existingAttendance.length === 0){
            return res.status(404).json({
                error:"Attendance not found for this date."
            })
        }

        const students = await prisma.student.findMany({
            where:{
                classId:classId
            }
        })

        if(students.length === 0){
            return res.status(404).json({
                error:"No students found in this class."
            })
        }

        for(const item of attendance){

            const student = students.find(
                student => student.id === Number(item.student_id)
            )

            if(!student){
                return res.status(400).json({
                    error:"Invalid student for this class."
                })
            }

            if(!["PRESENT","ABSENT"].includes(item.status)){
                return res.status(400).json({
                    error:"Invalid attendance status."
                })
            }
        }

        await prisma.$transaction(async (tx) =>{

            for(const item of attendance){

                await tx.attendance.update({
                    where:{
                        studentId_date:{
                            studentId:Number(item.student_id),
                            date:attendanceDate
                        }
                    },
                    data:{
                        status:item.status,
                        markedBy:req.user.id
                    }
                })

            }

        })

        return res.status(200).json({
            message:"Attendance updated successfully."
        });

    }catch(error){
        console.log(error);

        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })
    }
}

const getAttendanceSummary = async(req,res) =>{
    const {class_id,academicYearId,month} = req.query;

    if(!class_id || !month){
        return res.status(422).json({error:"Class and month are required."})
    }

    const classId = Number(class_id);
    if(!Number.isInteger(classId)){
        return res.status(422).json({error:"Invalid Class."})
    }

    try{
        let selectedAcademicYear;

        if(academicYearId){
            selectedAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id:Number(academicYearId)
                }
            })

            if(!selectedAcademicYear){
                return res.status(422).json({error:"Academic Year not found."})
            }
        }else{
            selectedAcademicYear = await prisma.academicYear.findFirst({
                where:{
                    isActive:true
                }
            })

            if(!selectedAcademicYear){
                return res.status(422).json({error:"Academic Year not found."})
            }
        }

        const selectedClass = await prisma.class.findUnique({
            where:{
                id:classId
            },
            include:{
                standard:true
            }
        })

        if(!selectedClass){
            return res.status(404).json({
                error:"Class not found."
            })
        }


        if(req.user.role === "teacher"){
            const teacher = await prisma.teacher.findUnique({
                where:{
                    userId:req.user.id
                }
            })

            if(!teacher){
                return res.status(404).json({error:"Teacher not found."})
            }

            if(teacher.classIncharge !== "Yes"){
                return res.status(403).json({
                    error:"You are not assigned as a class incharge."
                })
            }

            const selectedClassName = `${selectedClass.standard.name}-${selectedClass.name}`;

            if(selectedClassName !== teacher.classSection){
                return res.status(403).json({
                    error:"You can view attendance summary only for your assigned class."
                })
            }

        }
        const students = await prisma.student.findMany({
            where:{
                classId
            },include:{
                user:true
            },
            orderBy:{
                regNo:"asc"
            }
        })

        if(students.length === 0){
            return res.status(404).json({error:"No students found in this class."})
        }

     
const [year, monthNumber] = month.split("-").map(Number);

if(
    !year ||
    !monthNumber ||
    monthNumber < 1 ||
    monthNumber > 12
){
    return res.status(422).json({
        error:"Invalid month."
    })
}


        const monthStart = new Date(Date.UTC(year,monthNumber-1,1));
        const monthEnd = new Date(Date.UTC(year,monthNumber,0));

        if(monthStart < selectedAcademicYear.startDate || monthEnd > selectedAcademicYear.endDate){
            return res.status(422).json({
                error:"Selected month is outside the academic year."
            })
        }

        const calendarEntries = await prisma.schoolCalendar.findMany({
            where:{
                academicYearId:selectedAcademicYear.id,
                date:{
                    gte:monthStart,
                    lte:monthEnd
                }
            }
        })

        let workingDays = 0;

        for(let currentDate=new Date(monthStart);currentDate<=monthEnd;currentDate.setUTCDate(currentDate.getUTCDate()+1)){
            const day  = currentDate.getUTCDay();

            if(day === 0){
                continue;
            }

            const isBlocked = calendarEntries.some(
                entry => entry.date.getTime() === currentDate.getTime()
            )

            if(isBlocked){
                continue;
            }

        workingDays++;
        }

        const  attendanceRecords = await prisma.attendance.findMany({
            where:{
                academicYearId:selectedAcademicYear.id,
                date:{
                    gte:monthStart,
                    lte:monthEnd
                },
                studentId:{
                    in:students.map(student => student.id)
                }
            }
        })

        const summary = students.map(student =>{
            const studentAttendance = attendanceRecords.filter(
                record => record.studentId === student.id
            )

            const present = studentAttendance.filter(
                record => record.status === "PRESENT"
            ).length

            const absent = studentAttendance.filter(
                record => record.status === "ABSENT"
            ).length;

            const percentage = workingDays > 0
            ?Math.round((present/workingDays)*100):0;

            return {
                studentId:student.id,
                name:student.user.name,
                regNo:student.regNo,
                present,
                absent,
                percentage
            }
        })

        return res.status(200).json({
            academicYear:{
                id:selectedAcademicYear.id,
                name:selectedAcademicYear.name
            },
            class:{
                id:selectedClass.id,
                name:selectedClass.name,
                standard:selectedClass.standard.name
            },
            month,
            workingDays,
            students:summary
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong while getting attendance summary."
        })
    }
}

module.exports = {markAttendance,getAttendance,updateAttendance,getAttendanceSummary}