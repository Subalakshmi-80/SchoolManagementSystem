    const prisma = require("../prisma/prisma");

    const createAcademicYear = async(req,res)=>{
        const {name,startDate,endDate,isActive} = req.body;

        try{
            if(!name || !startDate || !endDate){
                return res.status(422).json({error:"Required fields are missing."})
            }

            const activeAcademicYear = await prisma.academicYear.findFirst({
        where: {
            isActive: true
        }

        
    })

    if(isActive && activeAcademicYear){
    return res.status(409).json({
        error:"Another Academic Year is already active."
    })
}
            const existingAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    name
                }
            })

            if(existingAcademicYear){
                return res.status(409).json({error:"Academic Year already exists"})
            }

            await prisma.academicYear.create({
                data:{
                    name,
                    startDate:new Date(startDate),
                    endDate:new Date(endDate),
                    isActive : isActive ?? false
                }
            })

            return res.status(201).json({message:"Academic Year created successfully."})
        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later."})
        }


    }

    const getAcademicYears = async(req,res)=>{
        try{
            const academicYears = await prisma.academicYear.findMany({
                orderBy:[
                    {isActive:"desc"},
                      {
            name: "asc"
        }
                ]
            });

            if(academicYears.length === 0){
                return res.status(404).json({error:"Academic Year not found"})
            }

            return res.status(200).json(academicYears)
        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later."})
        }
    }

    const getOneAcademicYear = async(req,res)=>{
        const id = Number(req.params.id);
        try{
            const academicYear = await prisma.academicYear.findUnique({
                where:{
                    id
                }
            })
            if(!academicYear){
                return res.status(404).json({error:"Academic Year not found"})
            }
            return res.status(200).json(academicYear)
        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later."})
        }
    }

    const updateAcademicYear =async(req,res) =>{
        const {name,startDate,endDate,isActive} = req.body;
        const id = Number(req.params.id);
        try{

            const existingAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id
                }
            })

            if(!existingAcademicYear){
                return res.status(404).json({error:"Academic Year not found."})
            }

            const updatedName = name || existingAcademicYear.name;
            const updatedStartDate = startDate
                ? new Date(startDate)
                : existingAcademicYear.startDate;

            const updatedEndDate = endDate
                ? new Date(endDate)
                : existingAcademicYear.endDate;
            const updatedIsActive = isActive ?? existingAcademicYear.isActive;

            
            if(updatedIsActive && await prisma.academicYear.findFirst({
    where:{
        isActive:true,
        id:{
            not:id
        }
    }
})){
    return res.status(409).json({
        error:"Another Academic Year is already active."
    })
}
            if(await prisma.academicYear.findFirst({
                where:{
                    name:updatedName,
                    id:{
                        not:id
                    }
                }
            })){
                return res.status(409).json({error:"Academic year already exists"})
            }

            const updatedAcademicYear = await prisma.academicYear.update({
                data:{
                    name:updatedName,
                    startDate:updatedStartDate,
                    endDate:updatedEndDate,
                    isActive:updatedIsActive

                },
                where:{
                    id
                }
            })
            return res.status(200).json({data:updatedAcademicYear,message:"Academic Year updated successfully."})
        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later."})
        }
    }


    const deleteAcademicYear = async(req,res)=>{
        const id = Number(req.params.id);

        try{
            const existingAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id
                }
            })
            if(!existingAcademicYear){
                return res.status(404).json({error:"Academic Year not found."})
            }

            await prisma.academicYear.delete({
                where:{
                    id
                }
            })

            return res.status(200).json({message:"Academic Year deleted successfully."})
        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later."})
        }
    }

    module.exports = {createAcademicYear,getAcademicYears,getOneAcademicYear,updateAcademicYear,deleteAcademicYear}