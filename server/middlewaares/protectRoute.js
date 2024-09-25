const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')
const {app} = require('../socket/socket')
const cookieParser = require('cookie-parser');
app.use(cookieParser())

const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        console.log(token)
        console.log(req.cookies)
        if(!token){
            console("failure")
            return res.status(401).json({err : "Unauthorised"});
        }
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
         
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