

const prisma = require("../prisma/prisma");

const createClass = async(req,res)=>{
    const {name,standard_id} = req.body;
    try{
        if(!name || !standard_id){
            return res.status(422).json({error:"Please enter class name and select standard"})
        }
    const classes = await prisma.class.findFirst({
        where:{
            name,
            standardId:standard_id
        }
    })
    if(classes){
        return res.status(409).json({error:"Class Already Exists"})
    }
    const newClass = await prisma.class.create({
        data:{
            name,
            standardId:standard_id
        }
    })
    return res.status(201).json({message:"Class created successfully",data:newClass})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong, Please try again later"})
    }



}

const getClass = async(req,res)=>{
    try{
        const classes = await prisma.class.findMany({
            include:{
                standard:true
            },
            orderBy:{
                id:"asc"
            }
        })
        return res.status(200).json(classes)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const getSingleClass = async(req,res)=>{
    const id = Number(req.params.id);

    try{
        const classes = await prisma.class.findUnique({
            where:{
                id
            },
            include:{
                standard:true
            }
        })
        if(!classes){
            return res.status(404).json({error:"Class not found"})
        }
        return res.status(200).json(classes)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}


const updateClass = async(req,res)=>{
    const {name,standardId} = req.body;
    const id = Number(req.params.id);

    try{
        if(!name || !standardId){
            return res.status(422).json({error:"Please enter the class and select the standard"})
        }
        const existingClass = await prisma.class.findUnique({where:{id}})

        if(!existingClass){
            return res.status(404).json({error:"Class not found"})
        }

        const checkExistingClass = await prisma.class.findFirst({
            where:{
                name,
                standardId,
                id:{
                    not:id
                }
            }
        })

        if(checkExistingClass){
            return res.status(409).json({error:"Class Already Exists"})
        }

        await prisma.class.update({
            where:{id},
            data:{
                name,
                standardId
            }
        })
        return res.status(200).json({message:"Class Updated Successfully"})

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}



const deleteClass = async(req,res)=>{
    const id = Number(req.params.id);

    try{
        const existingClass = await prisma.class.findUnique({where:{id}})

        if(!existingClass){
            return res.status(404).json({error:"Class not found."})
        }
        await prisma.class.delete({where:{id}})

        return res.status(200).json({message:"Class deleted successfully",data:existingClass})

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}




module.exports ={createClass,getClass,getSingleClass,updateClass,deleteClass}