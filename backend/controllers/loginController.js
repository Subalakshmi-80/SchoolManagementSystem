const pool = require("../db/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginController = (req,res)=>{
    
    const {email,password} = req.body;
    pool.query(`SELECT * FROM users WHERE email=$1`,[email],
        (err,result)=>{
             if(err){
                return res.status(500).send("Error,Try again later");
            }
            if(result.rows.length ==0){
                  return res.status(401).send("User Not Found");
            }
            const user = result.rows[0];

            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err){
                    return res.status(500).send("Error,Try Again Later");
                }
                if(!isMatch){
                    return res.status(401).send("invalid Credentials");
                }
                else{
                    const token = jwt.sign(
                        {id:user.id,email:user.email,role:user.role},
                        process.env.JWT_SECRET,
                        {expiresIn:"1h"}
                    )

                    res.json({"message":"Login successful","token":token,"role":user.role})
        }
         } )
})
}

module.exports = loginController