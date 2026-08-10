

    const prisma = require('../prisma/prisma')
    const bcrypt = require("bcrypt");


    const createStudent = async(req,res) =>{

        const { name, email, password, regno, first_name,
            last_name, gender, dob, phone, class_id, 
            address_line1,address_line2,city,state } = req.body;


        if (!name || !email || !password || !regno || !class_id) {
            return res.status(400).json({error:"Please provide mandatory fields"});
        }

        const classId = Number(class_id);
        const stddob = dob === "" ? null : dob;

        try{
        const checkExistingUser = await prisma.user.findUnique({
            where:{email}
        })
        if(checkExistingUser){
            return res.status(409).json({error:"Email already exists"})
        }

        const hash = await bcrypt.hash(password,10)

        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                password:hash,
                role:"student"
            }
        })

        const newStudent = await prisma.student.create({
            data:{
                userId:newUser.id,
                regNo:regno,
                firstName:first_name,
                lastName:last_name,
                gender:gender,
                dob:stddob,
                phone,
                classId,
                addressLine1:address_line1,
                addressLine2:address_line2,
                city,
                state
            }
        })


        return res.status(201).json({message:"Student created successfully"})

        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later"})
        }



    }

    const getStudents = async(req,res) =>{
        try{
            const students = await prisma.student.findMany({
                include:{
                    user:{
                        select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                        }

                    },
                    class:{
                        include:{
                            standard:true
                        }
                    }
                },
                orderBy:{
                    classId:"asc"
                }
            })

            return res.status(200).json(students)
        }
        catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later"})
        }
    }

    const getOneStd = async(req,res) =>{
        const id = Number(req.params.id);

        try{
            const student = await prisma.student.findUnique({
                where:{
                    id
                },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                            role:true
                        }
                    },
                    class:{
                        include:{
                            standard:true
                        }
                        
                    }
                }
            })
            if(!student){
                return res.status(404).json({error:"Student not found"})
            }
            return res.status(200).json(student)

        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later"})
        }
    }

    const updateStd = async(req,res) =>{
        const id = Number(req.params.id);

        const {regNo,firstName,lastName,gender,dob,phone,classId,addressLine1,addressLine2,city,state} = req.body;

        try{

            const existingStudent = await prisma.student.findUnique({where:{id}})

            if(!existingStudent){
                return res.status(404).json({error:"Student not found"})
            }

            const updatedRegNo = regNo || existingStudent.regNo;
            const updatedFirstName = firstName || existingStudent.firstName;
            const updatedLastName = lastName || existingStudent.lastName;
            const updatedGender = gender || existingStudent.gender;
            const updatedDob = dob ? new Date(dob): existingStudent.dob;
            const updatedPhone = phone || existingStudent.phone;
            const updatedClassId = classId || existingStudent.classId;
            const updatedAddressLine1 = addressLine1 || existingStudent.addressLine1;
            const updatedAddressLine2 = addressLine2 || existingStudent.addressLine2;
            const updatedCity = city || existingStudent.city;
            const updatedState = state || existingStudent.state;

            const updatedFullName = `${updatedFirstName} ${updatedLastName}`

            await prisma.student.update({
                where:{id},
                data:{
                    regNo:updatedRegNo,
                    firstName:updatedFirstName,
                    lastName:updatedLastName,
                    gender:updatedGender,
                    dob:updatedDob,
                    phone:updatedPhone,
                    classId:updatedClassId,
                    addressLine1:updatedAddressLine1,
                    addressLine2:updatedAddressLine2,
                    city:updatedCity,
                    state:updatedState
                }
            })

            await prisma.user.update({
                where:{
                    id:existingStudent.userId
                },data:{
                    name:updatedFullName
                }
            })
            return res.status(200).json({message:"Student updated successfully"})
        }
        catch(error){
            console.log(error);
            return res.status(500).json({error:"Something went wrong. Please try again later"})
        }
    }

    const deleteStd = async(req,res) =>{
        const id = Number(req.params.id);

        try{
 

        const student = await prisma.student.findUnique({where:{id}})

        if(!student){
            return res.status(404).json({error:"Student not found"})
        }

        await prisma.mark.deleteMany({
            where:{
                studentId:id
            }
        })

        await prisma.student.delete({
            where:{
                id
            }
        })

        await prisma.user.delete({
            where:{
                id:student.userId
            }
        })
        return res.status(200).json({message:"Student data deleted successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
    }


    module.exports = { createStudent, getStudents, getOneStd, updateStd,deleteStd };