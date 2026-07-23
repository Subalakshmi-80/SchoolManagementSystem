const pool = require("../db/db");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})


const forgotPassword = (req,res) =>{
    const {email} = req.body;

    pool.query(`SELECT * FROM users WHERE email=$1`,[email],(err,result) =>{

       if(err){
        return res.status(500).send("Database Error");
       } 
       if(result.rows.length === 0){
    
        return res.status(404).send("User Not Found");

       }

       const otp = Math.floor(100000 + Math.random() * 900000).toString();  

     const now = new Date();

const expires_at =new Date(now.getTime()+5*60*1000)
    

pool.query(`INSERT INTO password_reset(email,otp,expires_at) VALUES($1,$2,$3)`,[email,otp,expires_at],
    (err,result) =>{
        if(err){
console.log(err)
            return res.status(500).send("Database Error");
           
        }
const mailOptions ={
    from:process.env.EMAIL,
    to:email,
    subject:"Password Reset OTP",
    text:`Your OTP for password reset is ${otp}.It will expire in 5 minutes.`
}

transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
        console.log(err)
        return res.status(500).send("Error Sending Email");
    }
    else{
        return res.status(200).send("OTP sent to your email");
    }
})

        
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

        const otp = Math.floor(100000 +Math.random()*900000).toString()

        const now = new Date();
        const expires_at = new Date(now.getTime()+5*60*1000)

         pool.query(`UPDATE password_reset SET otp=$1,expires_at=$2 WHERE email=$3`,[otp,expires_at,email],
            (err,result) =>{
                if(err){
                    return res.status(500).send("Database Error")
                }
                const mailOption = {
                    from:process.env.EMAIL,
                    to:email,
                    subject:"Resend OTP",
                    text:`Your OTP for password reset is ${otp}.It will expire in 5 minutes.`
                }

                transporter.sendMail(mailOption,(err,info) =>{
                    if(err){
                        return res.status(500).send("Error sending OTP")
                    }
                    else{
                        return res.status(200).send("A new OTP has been sent to your email.")
                    }
                })
            }
         )
    })
}
module.exports ={forgotPassword,verifyOTP,resetPassword,resendOTP}