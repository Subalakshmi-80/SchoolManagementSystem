const jwt = require("jsonwebtoken");


function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send("No token,access denied");
    }
   const token = authHeader.split(" ")[1];
  
   jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
    if(err){
        return res.status(403).send("invalid token");
    }else{
    req.user = user;
    next();
    }

})
}

module.exports = authMiddleware