const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')

const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({err : "Unauthorised"});
        }
         
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({err : "Invalid token"});
        }
        
        const user = await userModel.findOne({_id : decoded.userId}).select('-password');
        if(!user){
            return res.status(401).json({err : "User not found"});
        }

        req.user = user;
        next();
    }catch(err){
        res.status(500).json({ msg : "err" });
    }
};

module.exports = protectRoute;