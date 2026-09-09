    const prisma = require('../prisma/prisma')

        const bcrypt = require("bcrypt");
        const jwt = require("jsonwebtoken");

        const loginController = async(req,res)=>{
            const {email,password} = req.body;

            if(!email || !password){
                return res.status(422).json({error:"Please fill all the details."})
            }
            try{

                const existingUser = await prisma.user.findUnique({where:{email:email}})

                if (!existingUser) {
                    return res.status(404).json({error:"User Not Found"});
                }
                const checkPassword =await bcrypt.compare(password,existingUser.password)
                    
                if(!checkPassword){
                            
                    return res.status(401).json({error:"invalid Credentials"});
                            
                }
                        
                const token = jwt.sign(
                    {id:existingUser.id,email:existingUser.email,role:existingUser.role,name:existingUser.name},
                    process.env.JWT_SECRET,
                    {expiresIn:"1h"}
                )
                            
                res.json({"message":"Login successful",
                    "token":token,"role":existingUser.role,
                    "name":existingUser.name,"email":existingUser.email})
    
                }catch(error){
                    console.log(error);
                    return res.status(500).json({error:"Error,please try again later"})
                }

        }
    

        module.exports = loginController