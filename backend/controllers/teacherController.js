
const bcrypt = require("bcrypt");

const prisma = require('../prisma/prisma');

const createTeacher = async(req,res) =>{
    const {
        name,email,password,empId,
        firstName,lastName,gender,
        dob,phone,classIncharge,
        classSection,subject,qualification
        ,addressLine1,addressLine2,
        city,state} = req.body;

        if(!email || !password || !name || !empId){
            return res.status(422).json({error:"Please enter the mandatory fields"})
        }

        const teacherdob = dob === "" ? null : new Date(dob);
        try{

            const checkExistingUser = await prisma.user.findUnique({where:{email}})

            if(checkExistingUser){
                return res.status(409).json({error:"Email already exists"})
            }

            const hash = await bcrypt.hash(password,10);

            await prisma.$transaction(async(tx)=>{

            const newUser = await tx.user.create({
                data:{
                    name,
                    email,
                    password:hash,
                    role:"teacher"
                }
            })
            const newTeacher = await tx.teacher.create({
                data:{
                    empId,
                    userId:newUser.id,
                    firstName,
                    lastName,
                    gender,
                    dob:teacherdob,
                    phone,
                    classIncharge,
                    classSection,
                    subject,
                    qualification,
                    addressLine1,
                    addressLine2,
                    city,
                    state

                }
            })

            })




            return res.status(201).json({message:"Teacher created successfully"})

        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later"})
        }
}

const getTeacher = async(req,res) =>{
    try{
        const teachers = await prisma.teacher.findMany({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }
        })

        return res.status(200).json(teachers);

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const getSingleTeacher = async(req,res) =>{
    const id = Number(req.params.id);
    try{
        const teacher = await prisma.teacher.findUnique({
            where:{id},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }
        })
        if(!teacher){
            return res.status(404).json({error:"Teacher not found"})
        }

        return res.status(200).json(teacher)
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const updateTeacher = async(req,res) =>{
    const id = Number(req.params.id);

    const {
        empId,firstName,lastName,
        gender,dob,phone,classIncharge,
        classSection,subject,qualification,
        addressLine1,addressLine2,state,city
    } = req.body

    try{
        const existingTeacher = await prisma.teacher.findUnique({where:{id}})

        if(!existingTeacher){
            return res.status(404).json({error:"Teacher not found"})
        }

        const updatedEmpId = empId || existingTeacher.empId;
        const updatedFirstName = firstName || existingTeacher.firstName;
        const updatedLastName = lastName || existingTeacher.lastName;
        const updatedGender = gender || existingTeacher.gender;
        const updatedDob = dob ? new Date(dob) : existingTeacher.dob;
        const updatedPhone = phone || existingTeacher.phone;
        const updatedClassIncharge = classIncharge || existingTeacher.classIncharge;
        const updatedClassSection = classSection || existingTeacher.classSection;
        const updatedSubject = subject || existingTeacher.subject;
        const updatedQualification = qualification || existingTeacher.qualification;
        const updatedAddressLine1 = addressLine1 || existingTeacher.addressLine1;
        const updatedAddressLine2 = addressLine2 || existingTeacher.addressLine2;
        const updatedCity = city || existingTeacher.city;
        const updatedState = state || existingTeacher.state;
        
        const updatedFullName = `${updatedFirstName} ${updatedLastName}`;

        await prisma.$transaction(async(tx)=>{
 
        await tx.teacher.update(
            {
                where:{id},
                data:{
                    empId:updatedEmpId,
                    firstName:updatedFirstName,
                    lastName:updatedLastName,
                    gender:updatedGender,
                    dob:updatedDob,
                    phone:updatedPhone,
                    classIncharge:updatedClassIncharge,
                    classSection:updatedClassSection,
                    subject:updatedSubject,
                    qualification:updatedQualification,
                    addressLine1:updatedAddressLine1,
                    addressLine2:updatedAddressLine2,
                    city:updatedCity,
                    state:updatedState

                }
            })


            await tx.user.update({
                where:{id:existingTeacher.userId},
                data:{
                    name:updatedFullName
                }
            })
        })


            return res.status(200).json({message:"Teacher data updated successfully"})

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}

const deleteTeacher = async(req,res) =>{
    const id = Number(req.params.id);

    try{

        const existingTeacher = await prisma.teacher.findUnique({
            where:{id}
        })

        if(!existingTeacher){
            return res.status(404).json({error:"Teacher not found."})
        }

        await prisma.$transaction(async(tx)=>{
                await tx.teacher.delete({
                where:{id}
            })

            await tx.user.delete({
                where:{
                    id:existingTeacher.userId
                }
            })
        })


        return res.status(200).json({message:"Teacher data deleted successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}


 

module.exports ={createTeacher,getTeacher,getSingleTeacher,updateTeacher,deleteTeacher};