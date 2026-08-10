

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
    const {class_id,day,period_id,subject_id} = req.body;

    try{
        const checkExistingPeriod = await prisma.timetable.findFirst({
            where:{
                classId:class_id,
                day,
                periodId:period_id
            }
        })

        if(checkExistingPeriod){
            return res.status(409).json({error:"Period allocated already for this class"})
        }

        await prisma.timetable.create({
            data:{
                periodId:period_id,
                day,
                classId:class_id,
                subjectId:subject_id
            }
        })
        return res.status(201).json({message:"Successfully created"})

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }
}

const getTimetableByClass = async(req,res) =>{
    const classId = Number(req.params.id);
    const {day} = req.query;

    try{
        const timetable = await prisma.timetable.findMany({
            where:{
                classId,
                day
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
                {day:"asc"},
                {periodId:"asc"}
            ]
        })

        return res.status(200).json(timetable)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}


const updateTimetable = async(req,res) =>{
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

        console.log(existingTimetable)
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