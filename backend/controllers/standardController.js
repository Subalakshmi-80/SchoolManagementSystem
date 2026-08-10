

const prisma = require("../prisma/prisma");

const createStandard = async(req,res)=>{
    const {name}= req.body;

    try{
if(!name){
        return res.status(422).json({error:"Please enter the Standard name"})
    }

    const existingStandard = await prisma.standard.findUnique({where:{name}})

    if(existingStandard){
        return res.status(409).json({error:"Standard name already exists."})
    }

    const newStandard = await prisma.standard.create({
        data:{
            name
        }
    })
    return res.status(201).json({
        message:"Standard created successfully",
        data:newStandard
    })
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }

    
}

const getStandards = async(req,res)=>{
    try{
    const standards = await prisma.standard.findMany({
        orderBy:{
            id:"asc"
        }
    })
    return res.status(200).json(standards)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }

}


const getOneStandard = async(req,res)=>{
    const id = Number(req.params.id);

    try{
        const standards = await prisma.standard.findUnique({where:{id}})

        if(!standards){
            return res.status(404).json({error:"Standard not found"})
        }
        return res.status(200).json(standards)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }
}

const updateStandard = async(req,res)=>{
    const {name} = req.body;
    const id = Number(req.params.id);

    try{
        if(!name){
            return res.status(422).json({error:"Please enter the standard name"})
        }
        const standard = await prisma.standard.findUnique({where:{id}})

        if(!standard){
            return res.status(404).json({error:"Standard not found."})
        }

        const checkExistingStandard = await prisma.standard.findFirst({
            where:{
                name,
                id:{
                    not:id
                }
            }
        })

        if(checkExistingStandard){
            return res.status(409).json({error:"Standard already exists"})
        }

        await prisma.standard.update({
            where:{
                id
            },
            data:{
                name
            }
        })
        return res.status(200).json({message:"Standard updated successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Something went wrong, Please try again later"})
    }
}


const deleteStandard = async(req,res)=>{
    const id = Number(req.params.id);

    try{
      const standard = await prisma.standard.findUnique({where:{id}})

      if(!standard){
        return res.status(404).json({error:"Standard not found."})
      }

      await prisma.standard.delete({
        where:{id}
      })

      return res.status(200).json({message:"Standard deleted Successfully",data:standard})


    }catch(error){
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

module.exports={createStandard,getStandards,getOneStandard,updateStandard,deleteStandard};