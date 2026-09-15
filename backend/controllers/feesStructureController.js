const prisma = require('../prisma/prisma');

const createFeeStructure = async(req,res)=>{
    const {academicYearId,standardId,feeType,amount,dueDate} = req.body;

    try{
        if(!academicYearId || !standardId || !feeType || !amount){
            return res.status(422).json({error:"Required fields are missing."})
        }

        const academicYear = await prisma.academicYear.findUnique({
            where:{
                id:Number(academicYearId)
            }
        })

        if(!academicYear){
            return res.status(404).json({error:"Academic year not found."})
        }

        const standard = await prisma.standard.findUnique({
            where:{
                id:Number(standardId)
            }
        })

        if(!standard){
            return res.status(404).json({error:"Standard not found."})
        }

        const existingFeeStructure = await prisma.feeStructure.findFirst({
            where:{
                academicYearId:Number(academicYearId),
                standardId:Number(standardId),
                feeType:feeType
            }
        });

        if(existingFeeStructure){
            return res.status(409).json({error:"Fee Structure already exists for this standard"})
        }

        const newFeeStructure = await prisma.feeStructure.create({
    data: {
        academicYearId: Number(academicYearId),
        standardId: Number(standardId),
        feeType,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null
    }
});

return res.status(201).json({
    data: newFeeStructure,
    message: "Fee structure created successfully."
});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }
}

const getFeeStructures = async(req,res)=>{
    try{
        const feeStructures = await prisma.feeStructure.findMany({
            include:{
                academicYear:true,
                standard:true
            }
        })

        if(feeStructures.length === 0){
            return res.status(404).json({error:"Fee Structures not found."})
        }
        return res.status(200).json(feeStructures)
    }catch(error){
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        });
    }
}

const getOneFeeStructure = async(req,res)=>{
    const id = Number(req.params.id);

    try{
        const feeStructure = await prisma.feeStructure.findUnique({
            where:{
                id
            },
            include:{
                academicYear:true,
                standard:true
            }
        });

        if(!feeStructure){
            return res.status(404).json({
                error:"Fee Structure not found."
            });
        }

        return res.status(200).json(feeStructure);

    }catch(error){
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        });
    }
}


const updateFeeStructure = async(req,res)=>{
    const id = Number(req.params.id);

    const {academicYearId,standardId,feeType,amount,dueDate} = req.body;

    try{

        const existingFeeStructure = await prisma.feeStructure.findUnique({
            where:{
                id
            }
        })

        if(!existingFeeStructure){
            return res.status(404).json({error:"Fees Structure not found."})
        }

        const updatedAcademicYearId = academicYearId || existingFeeStructure.academicYearId;
        const updatedStandardId = standardId || existingFeeStructure.standardId;
        const updatedFeeType = feeType || existingFeeStructure.feeType;
        const updatedAmount = amount || existingFeeStructure.amount;
        const updatedDueDate = dueDate ? new Date(dueDate) : existingFeeStructure.dueDate;


        const academicYear = await prisma.academicYear.findUnique({
            where:{
                id:Number(updatedAcademicYearId)
            }
        })

        if(!academicYear){
            return res.status(404).json({error:"Academic Year not found."})
        }

        const standard = await prisma.standard.findUnique({
            where:{
                id:Number(updatedStandardId)
            }
        })

        if(!standard){
            return res.status(404).json({error:"Standard not found."})
        }

        const checkExistingFeeStructure = await prisma.feeStructure.findFirst({
            where:{
                academicYearId:Number(updatedAcademicYearId),
                standardId:Number(updatedStandardId),
                feeType : updatedFeeType,
                id:{
                    not:id
                }
            }
        })

        if(checkExistingFeeStructure){
            return res.status(409).json({error:"Fees structure already exists for this standard"})
        }

        const updatedFeeStructure = await prisma.feeStructure.update({
            where:{
                id
            },
            data:{
                academicYearId:Number(updatedAcademicYearId),
                standardId:Number(updatedStandardId),
                feeType:updatedFeeType,
                amount:updatedAmount,
                dueDate:updatedDueDate
            }
        });

        return res.status(200).json({data:updatedFeeStructure,message:"Fees Structure updated successfully."})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }
 
}

const deleteFeeStructure = async(req,res)=>{
    const id = Number(req.params.id);
    try{
    const existingFeeStructure = await prisma.feeStructure.findUnique({
        where:{
            id
        }
    });

    if(!existingFeeStructure){
        return res.status(404).json({error:"Fees Structure not found."})
    }

    await prisma.feeStructure.delete({
        where:{
            id
        }
    })

    return res.status(200).json({message:"Fees structure deleted successfully."})
}catch(error){
    console.log(error);
    return res.status(500).json({error:"Something went wrong. Please try again later."})
}
}
module.exports = {createFeeStructure,getFeeStructures,getOneFeeStructure,updateFeeStructure,deleteFeeStructure};
