

function roleMiddleware(role){
    return (req,res,next)=>{
        if(req.user.role === role){
            next();
        }
        else{
            return res.status(403).send("Access denied");
        }
    }
}

module.exports = roleMiddleware;