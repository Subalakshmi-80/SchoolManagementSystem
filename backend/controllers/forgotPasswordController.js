
const bcrypt = require("bcrypt")
const axios = require('axios');
const prisma = require('../prisma/prisma')


const API_BASE_URL = process.env.BASEURL
const API_EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.TOKEN;

const API_URL = `${API_BASE_URL}/api/emails`;

const forgotPassword = async(req,res) =>{
    const {email} = req.body;

    try{
        const existingEmail = await prisma.user.findUnique({where:{email}})

        if(!existingEmail){
            return res.status(404).json({error:"User not found"})
        }

    
        await prisma.passwordReset.deleteMany({
            where:{email}
        })
        
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  

    const now = new Date();

    const expires_at =new Date(now.getTime()+1*60*1000)
    const resend_available_at = expires_at;

    await prisma.passwordReset.create({
        data:{
            otp,
            email,
            expiresAt:expires_at,
            resendAvailableAt:resend_available_at

        }
    })

     const response = await axios.post(API_URL,
                {
                    "title":"Password Reset OTP",
                    "message":`This is a OTP for Reset Password ${otp}`,
                    "to":email
                },
                {
                    headers:{
                    "X-Email":API_EMAIL,
                    "X-Token":API_TOKEN,
                    "Content-Type": "application/json"
                    }

                }
            )
             return res.status(200).send(response.data)

    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Failed to send OTP email"})
    }
}


const verifyOTP = async(req,res) =>{
    const {email,otp} = req.body;

    try{
        const checkOTP = await prisma.passwordReset.findFirst({
            where:{
                email,otp
            }
        })

        if(!checkOTP){
            return res.status(400).json({error:"Invalid OTP"})
        }

        if(new Date() > checkOTP.expiresAt){
            return res.status(400).json({error:"OTP Expired"});
        }

        return res.status(200).json({message:"OTP verified"})
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later."})
    }
}


const resetPassword = async(req,res) =>{
    const {email,password} = req.body;

    try{
        const user = await prisma.user.findUnique({where:{email}})

        if(!user){
            return res.status(404).json({error:"User not found."})
        }

        const hash = await bcrypt.hash(password,10);

        await prisma.user.update({
            where:{email},
            data:{
                password:hash
            }
        })

        await prisma.passwordReset.deleteMany({
            where:{email}
        })

        return res.status(200).json({message:"Password updated successfully"})

    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Something went wrong. Please try again later"})
    }
}


const resendOTP = async(req,res)=>{
    const {email} = req.body;

    try{
        const user = await prisma.user.findUnique({where:{email}})

        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        const now = new Date();



        const resendOtp = await prisma.passwordReset.findFirst({
            where:{
                email
            }
        })

        if(!resendOtp){
            return res.status(404).json({error:"Not found"})
        }
        if(now<resendOtp.expiresAt){
            return res.status(400).json({error:"Please wait until OTP expires"})
        }

        const otp = Math.floor(100000 +Math.random()*900000).toString()
        const expiresAt = new Date(now.getTime()+1*60*1000)
        const resendAvailableAt = expiresAt;

        await prisma.passwordReset.update({
            where:{
                id:resendOtp.id
            },
            data:{
                otp,
                expiresAt,
                resendAvailableAt
            }
        })

          const response = await axios.post(API_URL,
                        {
                            "title":"OTP resent successfully",
                            "message":`The new OTP is ${otp}`,
                            "to":email
                        },
                        {
                            headers:{
                                "X-Email":API_EMAIL,
                                "X-Token":API_TOKEN,
                                "Content-Type":"application/json"

                            }
                        }
            )

            return res.status(200).json({message:"OTP resent successfully"})

    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Failed to send OTP"})
    }
}

module.exports ={forgotPassword,verifyOTP,resetPassword,resendOTP}