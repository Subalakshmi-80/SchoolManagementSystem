

const prisma = require("../prisma/prisma");

const createTest = async(req,res)=>{
    const {name,class_id,subject_id,test_date,max_marks} = req.body;

      if(!name || !class_id || !subject_id || !test_date || max_marks === undefined || max_marks === null){
            return res.status(422).json({error:"Please enter the required fields"})
        }

        
    const classId = Number(class_id);
    const subjectId = Number(subject_id);
    const testDate = new Date(test_date);
    const maxMarks = Number(max_marks);

    if(!Number.isInteger(maxMarks) || maxMarks<=0){
        return res.status(422).json({error:"Maximum marks must be greater than 0"})
    }

    try{

        const existingTest = await prisma.test.findFirst({
            where:{
                name,
                classId,
                subjectId,
                testDate
            }
        })
        if(existingTest){
            return res.status(409).json({error:"Test already exists"})
        }

        const newTest = await prisma.test.create({
            data:{
                name,
                classId,
                subjectId,
                testDate,
                maxMarks
            }
        })
        return res.status(201).json({message:"Test created successfully",data:newTest})

        
    }catch(error){
        console.log(error)
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const getTests = async(req,res)=>{
    try{
        const tests = await prisma.test.findMany({
            include:{
                subject:true,
                class:{
                    include:{
                        standard:true   
                    }
                   
                },
                marks:true
            }  ,
            orderBy:{
                classId:"asc"
            } 
        })

       
        const result = tests.map(test=>({
            ...test,
            marksEntered:test.marks.length>0
        }))
        
        return res.status(200).json(result)


    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const getoneTest = async(req,res) =>{
    const id = Number(req.params.id);

    try{
        const test = await prisma.test.findUnique({
            where:{id},
            include:{
                subject:true,
                class:{
                    include:{
                        standard:true
                    }
                }
            }
        })
        if(!test){
            return res.status(404).json({error:"Test not found"})
        }
        return res.status(200).json(test)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}



const updateTest = async(req,res) =>{
    const {name,classId,subjectId,testDate,maxMarks} = req.body;

    const id = Number(req.params.id);


    try{
        const existingTest = await prisma.test.findUnique({
            where:{id}
        })
        if(!existingTest){
            return res.status(404).json({error:"Test not found"})
        }

        const updatedName = name || existingTest.name;
        const updatedClassId = classId || existingTest.classId;
        const updatedSubjectId = subjectId || existingTest.subjectId;
        const updatedTestDate =testDate? new Date(testDate) : existingTest.testDate;
        const updatedMaxMarks = 
                    maxMarks === undefined || maxMarks === null ? existingTest.maxMarks : Number(maxMarks); 

        if (!Number.isInteger(updatedMaxMarks) || updatedMaxMarks <= 0) {
        return res.status(422).json({
            error: "Maximum marks must be greater than 0"
        });
}

        const checkExistingTest = await prisma.test.findFirst({
            where:{
                name:updatedName,
                classId:updatedClassId,
                subjectId:updatedSubjectId,
                testDate:updatedTestDate,
                id:{
                    not:id
                }
            }
        })
        if(checkExistingTest){
            return res.status(409).json({error:"Test already exists"})
        }

        const marksEntered = await prisma.mark.findMany({
            where:{
                testId:id
            }
        })
        if(marksEntered.length>0 && updatedClassId !== existingTest.classId){
            return res.status(409).json({error:"Cannot change class. Marks have already been entered for this test."})
        }

        await prisma.test.update({
            where:{id},
            data:{
                name:updatedName,
                classId:updatedClassId,
                subjectId:updatedSubjectId,
                testDate:updatedTestDate,
                maxMarks:updatedMaxMarks
            }
        })
        return res.status(200).json({message:"Test updated successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
   
}



const deleteTest = async(req,res)=>{
    const id = Number(req.params.id);

    try{
        const existingTest = await prisma.test.findUnique({where:{id}})

        if(!existingTest){
            return res.status(404).json({error:"Test not found"})
        }
 
        const test = await prisma.test.delete({
            where:{
                id
            }
        })

        return res.status(200).json({message:`${test.name} deleted successfully`})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}



// get students by test
const getStudentByTest = async(req,res) =>{
    const testId = Number(req.params.id);

    try{
        const existingTest = await prisma.test.findUnique({where:{id:testId}})

        if(!existingTest){
            return res.status(404).json({error:"Test not found"})
        }

        const studentByTest = await prisma.student.findMany({
            where:{
                classId:existingTest.classId
            },
            include:{
                class:{
                    include:{
                        standard:true
                    }
                }
            },
            orderBy:{
                regNo:"asc"
            }
        })

        return res.status(200).json(studentByTest)
       
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

//store marks
const storeMarks = async(req,res)=>{
    const testId =Number(req.params.id);

    try{

    const test = await prisma.test.findUnique({where:{id:testId}})

    if(!test){
        return res.status(404).json({error:"Test not found"})
    }

    const checkExistingMarks = await prisma.mark.findMany({where:{testId}})
    
    if(checkExistingMarks.length > 0){
        return res.status(409).json({error:"Marks already entered for this test"})
    }

    const { marks } = req.body;

    if( !marks  || marks.length=== 0 ){
        return res.status(400).json({error:"Marks are required"})
    }

    await prisma.$transaction(async (tx)=>{
        for(const mark of marks){
            let stdId = mark.student_id;
            let enteredMark = mark.mark;
            let status = mark.status

            if(status === "Present"){

                if(enteredMark === null || enteredMark === undefined || enteredMark === ''){
                    throw new Error("Mark is required for present student")
                }
                if(enteredMark < 0 || enteredMark > test.maxMarks){
                    throw new Error("Entered mark is greater than max mark")
                }
            }

            if(status === "Absent"){
                enteredMark =null;
            }

            if(status !== "Present" && status !== "Absent"){
                throw new Error("Invalid status")
            }

            if(!await tx.student.findUnique({
                where:{
                    id:stdId
                }
            })){
                throw new Error("Student not found")
            }

            await tx.mark.create({
                data:{
                    testId,
                    studentId:stdId,
                    StdMarks:enteredMark,
                    status:status
                }
            })
        }

    })
      return res.status(201).json({message:"Marks added successfully"})


    }catch(error){
        console.log(error);
        if(error.message.includes("greater than")||
            error.message.includes("Mark is required") ||
            error.message.includes("Invalid status") ||
            error.message.includes("Student not found")){
            return res.status(400).json({error:error.message})
        }
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}
 
const viewMarks = async(req,res) =>{
    const testId = Number(req.params.id);

    try{

    const test = await prisma.test.findUnique({where:{id:testId}})

    if(!test){
        return res.status(404).json({error:"Test not found"})
    }

    const marks = await prisma.mark.findMany({
        where:{
            testId
        },include:{
            student:{
                select:{
                    id:true,
                    firstName:true,
                    lastName:true,
                    regNo:true
                }
            },test:{
                include:{
                    class:{
                include:{
                    standard:true
                }
            }
                }
            }
          
        },
        orderBy:{
            student:{
                regNo:"asc"
            }
        }

    })
    return res.status(200).json(marks);
}catch(error){
    console.log(error);
    return res.status(500).json({error:"Something went wrong. Please try again later"})
}
}

const updateMarks = async(req,res) =>{
    const testId = Number(req.params.id);

    const {updateMark} = req.body;
  
    try{

       
        const test = await prisma.test.findUnique({where:{id:testId}})

        if(!test){
            return res.status(404).json({error:"Test not found."})
        }

        if(!updateMark || updateMark.length === 0){
            return res.status(400).json({error:"Marks are required"})
        }


        await prisma.$transaction(async(tx)=>{
            for(const mark of updateMark){
                let studentId = mark.studentId
                let StdMarks = mark.StdMarks;
                let status = mark.status;

                if(status === 'Present'){
                    if(StdMarks === null || StdMarks === undefined || StdMarks === ''){
                        throw new Error("Mark is required for present student")
                    }
                    if(StdMarks < 0 || StdMarks > test.maxMarks){
                        throw new Error("Entered mark is greater than max mark")
                    }
                }

                if(status === 'Absent'){
                    StdMarks =null;
                }

                if(status !== 'Present' && status !== 'Absent'){
                    throw new Error("Invalid status")
                }

                const existingMark = await tx.mark.findFirst({
                    where:{
                        testId,
                        studentId
                    }
                })

                if(!existingMark){
                    throw new Error("Mark not found")
                }

                await tx.mark.update({
                    where:{
                       id:existingMark.id
                    },data:{
                        status:status,
                        StdMarks:StdMarks
                    }
                })
                
            }
        })

            return res.status(200).json({message:"Marks updated successfully"})

    }catch(error){
        console.log(error);

        if(error.message.includes("greater than")
             || error.message.includes("Invalid status")
             || error.message.includes("Mark not found")
             || error.message.includes("Mark is required")){
            return res.status(400).json({error:error.message})
        }
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}



module.exports = {
    createTest,
    getTests,
    getoneTest,
    updateTest,
    deleteTest,
    getStudentByTest,
    storeMarks,
    viewMarks,
    updateMarks
}