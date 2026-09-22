const prisma = require('../prisma/prisma');

const createFeePayment = async(req,res)=>{

    const {studentId,feeStructureId,amountPaid,paymentDate,remarks} = req.body;

    const receiptNo = `REC-${Date.now()}`;


    try{
        if(!studentId || !feeStructureId || !amountPaid || !paymentDate){
        return res.status(422).json({error:"Required fields are missing"})
        }

        if(Number(amountPaid)<= 0){
            return res.status(422).json({error:"Amount paid must be greater than 0"})
        }

        const existingStudent = await prisma.student.findUnique({
            where:{
                id:Number(studentId)
            },
            include:{
                class:{
                    include:{
                        standard:true
                    }
                },
                user:true
            }
        })

        if(!existingStudent){
            return res.status(404).json({error:"Student not found."})
        }

        const existingFeeStructure = await prisma.feeStructure.findUnique({
            where:{
                id:Number(feeStructureId)
            }
        })

        if(!existingFeeStructure){
            return res.status(404).json({
                error:"Fees Structure not found."
            })
        }

        if(existingStudent.class.standard.id !== existingFeeStructure.standardId){
            return res.status(400).json({
                error:"Fee Structure does not belong to the student's standard."
            })
        }

        const paymentTotal = await prisma.feePayment.aggregate({
            where:{
                studentId:Number(studentId),
                feeStructureId:Number(feeStructureId)
            },
            _sum:{
                amountPaid:true
            }
        })

        const totalPaid = paymentTotal._sum.amountPaid || 0;

        const remainingBalance = Number(existingFeeStructure.amount)-Number(totalPaid);

        if(Number(amountPaid) >remainingBalance){
            return res.status(400).json({
                error:`Amount exceeds the remaining balance of ₹${remainingBalance}`
            })
        }

        const newFeePayment = await prisma.feePayment.create({
            data:{
                receiptNo:receiptNo,
                studentId :Number(studentId),
                feeStructureId:Number(feeStructureId),
                amountPaid,
                paymentDate:new Date(paymentDate),
                remarks:remarks || null
            }
        })

        return res.status(201).json({
            data:newFeePayment,
            message:`${existingStudent.class.standard.name}-${existingStudent.class.name} ${existingStudent.user.name} ${existingFeeStructure.feeType} paid successfully`        
            })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })
    }
}

const getStudentFees = async(req,res)=>{
    const studentId = Number(req.params.studentId);
    const academicYearId = Number(req.params.academicYearId);

    try{
        const student = await prisma.student.findUnique({
            where:{
                id:studentId
            },
            include:{
                class:{
                    include:{
                        standard:true
                    }
                },user:true
            }
        })

        if(!student){
            return res.status(404).json({
                error:"Student not found."
            })
        }

        const academicYear = await prisma.academicYear.findUnique({
            where:{
                id:academicYearId
            }
        })
        if(!academicYear){
            return res.status(404).json({error:"Academic Year not found."})
        }

        const feeStructure = await prisma.feeStructure.findMany({
            where:{
                academicYearId:academicYearId,
                standardId:student.class.standard.id
            }
        })

        if(feeStructure.length === 0){
            return res.status(404).json({
                error:"No fees structures found for this student."
            })
        }
        const fees = await Promise.all(
            feeStructure.map(async(fee)=>{
                const paymentTotal = await prisma.feePayment.aggregate({
                    where:{
                        studentId:student.id,
                        feeStructureId:fee.id
                    },
                    _sum:{
                        amountPaid:true
                    }
                })
                const totalPaid = paymentTotal._sum.amountPaid || 0;
                const balance = Number(fee.amount) - Number(totalPaid);


                let status;

                if(totalPaid === 0){
                    status="Pending"
                }else if(balance === 0){
                    status = "Paid"
                }else{
                    status = "Partial"
                }

                return{
                    feeId:fee.id,
                    feeType:fee.feeType,
                    totalAmount:fee.amount,
                    totalPaid,
                    balance,
                    status,
                    dueDate:fee.dueDate
                }
            })
        )

        return res.status(200).json({
            student,academicYear,fees
        })


    }catch(err){
        console.log(err);
        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })
    }
}


const getClassStudentsFees = async (req, res) => {
    const classId = Number(req.params.classId);
    const academicYearId = Number(req.query.academicYearId);

    try {
        const students = await prisma.student.findMany({
            where: {
                classId: classId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                class:{
                    include:{
                        standard:true   
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });

        if(students.length === 0){
            return res.status(404).json({error:"Students not found."})
        }
        const feeStructures = await prisma.feeStructure.findMany({
            where:{
                academicYearId:academicYearId,
                standardId:students[0].class?.standard?.id
            }
        })

        const studentsData = await Promise.all(
            students.map(async (student) =>{
                const fees = await Promise.all(
                    feeStructures.map(async (fee) => {

                        const paymentTotal = await prisma.feePayment.aggregate({
                            where:{
                                studentId:student.id,
                                feeStructureId:fee.id,
                                
                            },
                            _sum:{
                                amountPaid:true
                            }
                        })

                        const totalPaid = paymentTotal._sum.amountPaid || 0;
                        const balance = Number(fee.amount) - Number(totalPaid);

                        let status;

                        if(totalPaid === 0){
                            status="Pending"
                        }else if(balance === 0){
                            status = "Paid"
                        }else{
                            status = "Partial"
                        }

                        return {
                            feeId :fee.id,
                            feeType:fee.feeType,
                            totalAmount:fee.amount,
                            totalPaid,
                            balance,
                            status,
                            dueDate:fee.dueDate
                        }
                    })
                )

                return {
                    studentId:student.id,
                    name:student.user.name,
                    regNo:student.regNo,
                    email:student.user.email,
                    fees
                }
            })
        )
        return res.status(200).json(studentsData);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        });
    }
};

const getFeeDashboard = async(req,res)=>{
    const academicYearId = req.query.academicYearId ? Number(req.query.academicYearId):null;

    try{
        let academicYear;

        if(academicYearId){
            academicYear = await prisma.academicYear.findUnique({
                where:{
                    id:academicYearId
                }
            })
        }else{
            academicYear = await prisma.academicYear.findFirst({
                where:{
                    isActive:true
                }
                
            })
            if(!academicYear){
                academicYear = await prisma.academicYear.findFirst({
                    orderBy:{
                        startDate:"desc"
                    }
                })
            }
        }
        if(!academicYear){
            return res.status(404).json({
                error:"Academic Year not found."
            })
        }

        const classId = req.query.classId ? Number(req.query.classId):null;

        const classes = await prisma.class.findMany({
            where:classId?{id:classId}:undefined,
            include:{
                standard:true,
                students:true
            },
              orderBy: {
        id: "asc"
    }
        })

        const classData = await Promise.all(
          classes.map(async (classItem) =>{
            const students = classItem.students;
            const totalStudents = students.length;

            const feeStructures = await prisma.feeStructure.findMany({
                where:{
                    academicYearId:academicYear.id,
                    standardId:classItem.standardId
                }
            })

            if(feeStructures.length === 0){
                return{
                    classId:classItem.id,
                    standard:classItem.standard.name,
                    className:classItem.name,
                    totalStudents,
                    paid: 0,
                    partial: 0,
                    pending: 0
                }
            }

            const studentData = await Promise.all(
                students.map(async (student)=>{
                    const payments =  await prisma.feePayment.findMany({
                        where:{
                            studentId:student.id,
                            feeStructureId:{
                                in:feeStructures.map(fee=>fee.id)
                            }
                        }
                    })
                    const totalFee = feeStructures.reduce(
                        (sum,fee) => sum + Number(fee.amount),0
                    );

                    const totalPaid = payments.reduce(
                        (sum,payment)=>sum+ Number(payment.amountPaid),0
                    );

                    const balance = totalFee - totalPaid;

                    const today = new Date().toISOString().slice(0,10);

                    const todayPaid = payments.reduce(
                        (sum,payment)=>{
                            const paymentDate = payment.paymentDate.toISOString().slice(0,10);

                            if(paymentDate === today){
                                return sum + Number(payment.amountPaid)
                            }
                            return sum;
                        },0
                    )
                    let status;

                    if(totalPaid === 0){
                        status = "Pending";
                    }else if(balance===0){
                        status = "Paid"
                    }else{
                        status = "Partial"
                    }

                     return {
                        studentId:student.id,
                        totalFee,
                        totalPaid,
                        balance,
                        status,
                        todayPaid
                    }
                })

             
            )

            const paid = studentData.filter(
                student => student.status === "Paid"
            ).length;

            const partial = studentData.filter(
                student => student.status === "Partial"
            ).length

            const pending = studentData.filter(
                student => student.status === "Pending"
            ).length

            const totalFee = studentData.reduce(
                (sum,student) => sum+student.totalFee,0
            );

            const totalPaid = studentData.reduce(
                (sum,student)=>sum+student.totalPaid,0
            )
            const totalPending = studentData.reduce(
                (sum,student) =>sum+student.balance,0
            )

            const todayReceived = studentData.reduce(
                (sum,student)=>sum + student.todayPaid,0
            )
        return{
            classId:classItem.id,
            standard:classItem.standard.name,
            className:classItem.name,
            totalStudents:totalStudents,
            paid:paid,
            partial:partial,
            pending:pending,
            totalFee,
            totalPaid,
            totalPending,
            todayReceived
          }
          })
        
        )
        const totalStudents = classData.reduce(
            (sum,classItem)=>sum+classItem.totalStudents,0
        )

        const paidStudents = classData.reduce(
            (sum,classItem)=>sum+classItem.paid,0
        )

        const partialStudents = classData.reduce(
            (sum,classItem)=>sum+classItem.partial,0
        )

        const pendingStudents = classData.reduce(
            (sum,classItem)=>sum+classItem.pending,0
        )

        const totalFee = classData.reduce(
            (sum,classItem)=>sum+ (classItem.totalFee || 0),0
        )

        const totalPaid = classData.reduce(
            (sum,classItem) => sum + (classItem.totalPaid || 0),0
        )
        
        const totalPending = classData.reduce(
            (sum,classItem) => sum + (classItem.totalPending || 0),0
        )

        const todayReceived = classData.reduce(
            (sum,classItem) => sum + (classItem.todayReceived || 0),0
        )

        return res.status(200).json({
            academicYear,
            summary:{
                totalStudents,
                paidStudents,
                partialStudents,
                pendingStudents,
                totalFee,
                totalPaid,
                totalPending,
                todayReceived
            },
            classes:classData
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })
    }
}
module.exports = {createFeePayment,getStudentFees,getFeeDashboard,getClassStudentsFees}