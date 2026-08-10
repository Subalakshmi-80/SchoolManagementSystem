
const prisma = require('../prisma/prisma')
const createSubject = async(req,res)=>{
    const {subject_name} = req.body;

    try{
        if(!subject_name){
            return res.status(422).json({error:"Please enter the Subject name "})
        }
        const existingSubject = await prisma.subject.findUnique({where:{subjectName:subject_name}})

        if(existingSubject){
            return res.status(409).json({error:"Subject name already exists"})
        }

        
        const newSubject = await prisma.subject.create({
            data:{
                subjectName:subject_name
            }
        })
        return res.status(201).json(
            {
                message:"Subject Created Successfully.",
                data:newSubject
            })
    }catch(error){
           console.log(error)
        return res.status(500).json({
        error:"Something went wrong. Please try again later."
    })
    }
  
}

const getSubjects = async(req,res)=>{
    try{
    const subjects = await prisma.subject.findMany({
        orderBy:{
            id:"asc"
        }
    })
    return res.status(200).json(subjects)
    }catch(error){
          console.log(error)
        return res.status(500).json({
        error:"Something went wrong. Please try again later."
    })
    }

}

const getOneSubject = async(req,res)=>{
    const id = Number(req.params.id);

    try{
    const subjects = await prisma.subject.findUnique({
        where:{
            id:id
        }
    })
    if(!subjects){
        return res.status(404).json({error:"Subject not found."})
    }
    return res.status(200).json(subjects)
    }catch(error){
          console.log(error)
        return res.status(500).json({
        error:"Something went wrong. Please try again later."
    })
    }

}

const updateSubject = async(req,res)=>{
    const {subject_name} = req.body;

    const id = Number(req.params.id);

    try{
        if(!subject_name){
            return res.status(422).json({error:"Please enter the subject name"})
        }
        const subject = await prisma.subject.findUnique({where:{id}})

        if(!subject){
            return res.status(404).json({error:"Subject not found."})
        }
        const checkExistingSubject = await prisma.subject.findFirst({
            where:{
                subjectName:subject_name,
                id:{
                    not:id
                }
            }
        })

        if(checkExistingSubject){
            return res.status(409).json({error:"Subject already exists."})
        }

        await prisma.subject.update({
            where:{
                id:id
            },
            data:{
                subjectName:subject_name
            }
        })

        return res.status(200).json({message:"Subject updated successfully."})
    }catch(error){
        console.log(error)
        return res.status(500).json({
        error:"Something went wrong. Please try again later."
    })
    }
}



const deleteSubject = async(req,res)=>{
    const id = Number(req.params.id);

    try{
   const subjects = await prisma.subject.findUnique({where:{id}})

    if(!subjects){
        return res.status(404).json({error:"Subject not found."})
    }
    await prisma.subject.delete({
        where:{
            id
        }
    })
    return res.status(200).json({message:"Subject deleted Successfully.",data:subjects})
    }catch(error){
        console.log(error)
        return res.status(500).json({
        error:"Something went wrong. Please try again later."
    })
    }
 
}

module.exports = {createSubject,getSubjects,getOneSubject,updateSubject,deleteSubject}