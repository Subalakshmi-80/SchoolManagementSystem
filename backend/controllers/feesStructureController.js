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
                feeType
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
module.exports = {createFeeStructure,getFeeStructures,getOneFeeStructure}