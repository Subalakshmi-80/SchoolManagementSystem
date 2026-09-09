

const prisma = require('../prisma/prisma');

const getPeriods = async(req,res)=>{
    try{
    const periods = await prisma.period.findMany({
        orderBy:{
            periodNo:"asc"
        }
    })
    if(periods.length === 0){
        return res.status(404).json({error:"Periods not found."})
    }

    return res.status(200).json(periods)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. please try again later"})
    }


}

const createTimetable = async(req,res)=>{
    const {class_id,timetable} = req.body;

    if(!class_id || !Array.isArray(timetable) || timetable.length ===0){
        return res.status(400).json({error:"Class and timetable are required"})
    }

    for(const item of timetable){
        if(!item.day || !item.period_id || !item.subject_id){
            return res.status(400).json({
                error:"Day,Period and Subject are required"
            })
        }
    }

    try{

       await prisma.$transaction(async (tx)=>{
            for(const item of timetable){
                const existing = await tx.timetable.findFirst({
                    where:{
                        classId:class_id,
                        day:item.day,
                        periodId:item.period_id
                    }
                })

                if(existing){
                    throw new Error( `Period ${item.period_id} already allocated for ${item.day}`)
                }

                await tx.timetable.create({
                    data:{
                        classId:class_id,
                        day:item.day,
                        periodId:item.period_id,
                        subjectId:item.subject_id
                    }
                   
                })
            }
       })

       return res.status(201).json({message:"Timetable created successfully"})
    }catch(error){
         console.log(error);

         if(error.message.includes("already allocated")){
            return res.status(409).json({error:error.message})
         }
        return res.status(500).json({error:"Something went wrong. Please try again later."})   
    }
}

const getTimetableByClass = async(req,res) =>{
    const classId = Number(req.params.id);


    try{
        const timetable = await prisma.timetable.findMany({
            where:{
                classId,
             
              
            },
            include:{
                class:{
                    include:{
                        standard:true
                    }
                },
                period:true,
                subject:true
            },
            orderBy:[
                
                {periodId:"asc"}
            ]
        })

        return res.status(200).json(timetable)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const updateTimetable = async(req,res)=>{
    const {class_id,timetable} = req.body;
    const classId =Number(class_id)
    if(!class_id || !Array.isArray(timetable) || timetable.length === 0){
        return res.status(400).json({error:"Class and timetable are required"})
    }

    for(const item of timetable){
        if(!item.day || !item.period_id || !item.subject_id){
            return res.status(400).json({error:"Day,Period and subject are required"})
        }
    }

    try{
        await prisma.$transaction(async(tx)=>{
            for(const item of timetable){
                const existing = await tx.timetable.findFirst({
                    where:{
                        day:item.day,
                        periodId:item.period_id,
                        classId
                    }
                })

                if(!existing){
                    throw new Error(`Timetable not found for ${item.day} ${item.period_id}`)
                }

                await tx.timetable.update({
                    where:{
                        id:existing.id
                    },
                    data:{
                        subjectId:item.subject_id
                    }
                })
            }


        })

        return res.status(200).json({message:"Timetable updated successfully"})
    }catch(err){

        console.log(err)
        if(err.message.includes("not found")){
            return res.status(404).json({error:err.message})
        }
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}
const updateTimetale = async(req,res) =>{
    const {classId,periodId,day,subjectId} = req.body;

    const subject_id = Number(subjectId)

    try{
        const existingTimetable = await prisma.timetable.findFirst({
            where:{
                classId,
                periodId,
                day
            }
        })

        if(!existingTimetable){
            return res.status(404).json({error:"Timetable not found"})
        }

      
        await prisma.timetable.update({
            where:{
              id:existingTimetable.id
            },
            data:{
                subjectId:subject_id
            }
        })

        return res.status(200).json({message:"Updated successfully"})

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

    

module.exports = {getPeriods,createTimetable,getTimetableByClass,updateTimetable}