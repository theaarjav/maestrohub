const jwt=require("jsonwebtoken");

let authenticate=async(req, res,next)=>{
    try {
        let token;
        if(!req.headers.authorization)return res.status(401).json({msg:"User unauthorized"});
        if(req.headers.authorization.startsWith("Bearer")) {
            // console.log(req.body, req.headers.authorization)
            token=req.headers.authorization.split(" ")[1];
        }
        else{
            return res.status(401).json({msg:"User unauthorized"})
        }
        if(!token) return res.status(401).json({msg:"User unauthorized"});
        const ver= jwt.verify(token, process.env.JWSToken);
        req.user=ver.user;
        next();
    } catch (err) {
        // console.log()
        console.log("Error: ", err);
        res.status(500).json({msg: "Invalid Token"});
    }
}
module.exports=authenticate