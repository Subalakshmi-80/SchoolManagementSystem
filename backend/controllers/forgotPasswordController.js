const pool = require("../db/db");
const bcrypt = require("bcrypt")
const axios = require('axios')


const API_BASE_URL = process.env.BASEURL
const API_EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.TOKEN;

const API_URL = `${API_BASE_URL}/api/emails`
const forgotPassword = (req,res) =>{
    const {email} = req.body;

    pool.query(`SELECT * FROM users WHERE email=$1`,[email],(err,result) =>{

       if(err){
        return res.status(500).send("Database Error");
       } 
       if(result.rows.length === 0){
    
        return res.status(404).send("User Not Found");

       }
       if(result.rows.length > 0){
        pool.query(`DELETE FROM password_reset WHERE email=$1`,[email],
            (err,result)=>{
                if(err){
                    return res.status(500).send("Database Error")
                }
            }
        )
       }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();  

    const now = new Date();

    const expires_at =new Date(now.getTime()+1*60*1000)
    const resend_available_at = expires_at

    pool.query(`INSERT INTO password_reset(email,otp,expires_at,resend_available_at) VALUES($1,$2,$3,$4)`,
        [email,otp,expires_at,resend_available_at],
       async (err,result) =>{
            if(err){
                console.log(err)
                return res.status(500).send("Database Error");  
            }
            try{
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
            }
          catch(error){
                console.log(error)
                return res.status(500).send("Failed to send OTP email")
            }
        }
    )

        })
    }


const verifyOTP = (req,res) =>{
    const {email,otp} = req.body;

    pool.query(`SELECT * FROM password_reset WHERE email=$1 AND otp=$2`,
        [email,otp],(err,result) =>{
            if(err){
                return res.status(500).send("Database Error");
            }
            if(result.rows.length === 0){
                return res.status(400).send("Invalid OTP");
            }
            if(new Date() > result.rows[0].expires_at){
                return res.status(400).send("OTP Expired");
            }
            return res.status(200).send("OTP Verified")
        }
    )
}


const resetPassword = (req,res) =>{
    const {email,password} = req.body;
    pool.query(`SELECT * FROM users WHERE email=$1`,[email],(err,result) =>{
    if(err){
        return res.status(500).send("Database Error")
    }
    if(result.rows.length === 0){
        return res.status(404).send("User Not Found");
    }
   

    bcrypt.hash(password,10,(err,hash) =>{
    if(err){
        return res.status(500).send('Error,Try Again Later')
    }
    pool.query(`UPDATE users SET password=$1 WHERE email=$2`,[hash,email],
        (err,result) =>{
            if(err){
                return res.status(500).send("Database Error");
            }

            pool.query(`DELETE FROM password_reset WHERE email=$1`,[email],(err,result)=>{
                if(err){
                    return res.status(500).send("Database Error")
                }
                  return res.status(200).send("Password Updated Successfully")
            })
          
        }
    )

    })

     
})

   
}

const resendOTP = (req,res) =>{
    const {email} = req.body;

    pool.query(`SELECT * FROM users WHERE email=$1`,[email],(err,result) =>{
        if(err){
            return res.status(500).send("Database Error")
        }
        if(result.rows.length === 0){
            return res.status(404).send("User Not Found")
        }


        const now = new Date();
       

        pool.query(`SELECT * FROM password_reset WHERE email=$1`,[email],
            (err,result)=>{
                if(err){
                    return res.status(500).send("Database Error");
                }
                if(result.rows.length === 0){
                    return res.status(404).send("Not Found")
                }
                if(now<result.rows[0].resend_available_at){
                    return res.status(400).send("Please wait until OTP expires")
                }

                
        const otp = Math.floor(100000 +Math.random()*900000).toString()
         const expires_at = new Date(now.getTime()+1*60*1000)
         const resend_available_at = expires_at
                 pool.query(`UPDATE password_reset SET otp=$1,expires_at=$2,resend_available_at=$3 WHERE email=$4`,
                    [otp,expires_at,resend_available_at,email],
                async(err,result) =>{
                if(err){
                    return res.status(500).send("Database Error")
                }
               
                try{
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
                    return res.status(200).send("OTP resent successfully")
                }catch(err){
                    return res.status(500).send("Failed to send OTP")
                }

            }
         )
                }

        
            
        )

      
    })
}
module.exports ={forgotPassword,verifyOTP,resetPassword,resendOTP}