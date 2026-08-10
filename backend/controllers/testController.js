const pool = require('../db/db')

const prisma = require("../prisma/prisma");

const createTest = async(req,res)=>{
    const {name,class_id,subject_id,test_date} = req.body;

     if(!name || !class_id || !subject_id || !test_date){
            return res.status(422).json({error:"Please enter the required fields"})
        }

    const classId = Number(class_id);
    const subjectId = Number(subject_id);
    const testDate = new Date(test_date)

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
                testDate
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
                   
                }
            }
        })
        return res.status(200).json(tests)


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
    const {name,classId,subjectId,testDate} = req.body;

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
        const updatedTestDate =testDate? new Date(testDate) : existingTest.testDate

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
                testDate:updatedTestDate
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
        await prisma.mark.deleteMany({
            where:{
                testId:id
            }
        })

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
    
    if(checkExistingMarks.length>0){
        return res.status(409).json({error:"Marks already entered for this test"})
    }

    let completed = 0
    const { marks } = req.body;

    for (let i = 0; i < marks.length; i++) {

        let stdId = marks[i].student_id;
        let mark = marks[i].mark;

       const marked= await prisma.mark.create({
          data:{
            testId,
            studentId:stdId,
            StdMarks:mark
          }
        })
       completed++
    }
       

        if(completed == marks.length){
            return res.status(201).json({message:"Marks added successfully"})
        }
    }catch(error){
        console.log(error);
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



        for(let i=0;i<updateMark.length;i++){
            let studentId=updateMark[i].studentId;
            let StdMarks = updateMark[i].StdMarks;

            const mark = await prisma.mark.findFirst({
                where:{
                    testId,
                    studentId
                }
            })
            if(!mark){
                return res.status(404).json({message:"Mark not found"})
            }

            await prisma.mark.update({
                where:{
                    id:mark.id
                },data:{
                    StdMarks
                }
            })

        }

            return res.status(200).json({message:"Marks updated successfully"})

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}


const updateMaks = (req, res) => {
    const testId = req.params.id;

    const {updateMark} = req.body;

    pool.query(`SELECT * FROM tests WHERE id=$1`, [testId],
        (err, result) => {
            if (err) {
                return res.status(500).send("Database Error")
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Test Not Found.");
            }

            let completed = 0;

            for (let i = 0; i < updateMark.length; i++) {
                let std_id = updateMark[i].student_id;
                let std_mark = updateMark[i].std_marks;

                pool.query(`UPDATE marks SET std_marks=$1 WHERE student_id=$2 AND test_id=$3 `,
                    [std_mark, std_id, testId], (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send("Database Error")
                        }

                        completed++;

                        if (completed === updateMark.length) {
                            return res.status(200).send("Marks Updated Successfully")
                        }

                    }
                )
            }
        }
    )
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