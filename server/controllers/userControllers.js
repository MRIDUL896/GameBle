const pswdStrength = require('../middlewaares/passwordStrength');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const generateTokenAndSetCookie = require('../utils/generateToken');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const saltRound = process.env.SALT;


const handleSignup = async (req , res) => {
    let user = req.body;
    try {
        const pswd = user.password;
        const email = user.email;
        const existing = await userModel.findOne({email});
        if(existing){
            return res.json({message : "user already registered"})
        }
        if(pswdStrength(pswd) == "weak"){
            return res.json({ message: "password too weak" });
        }
        else{
            //hash
            const hashedPass = await bcrypt.hash(pswd,saltRound);
            user.password = hashedPass;
            //creating user
            const newUser = await userModel.create(user);
            if (newUser) {
                // Generate JWT token here
                generateTokenAndSetCookie(newUser._id, res);
                await newUser.save();
    
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    profilePic: newUser.profilePic,
                });
            } else {
                res.status(400).json({ error: "Invalid user data" });
            }
            res.status(201).json({ 
                message: "User created successfully", 
                userId: newUser._id ,
                token: token
            });
        }
    }catch(err){
        console.log({"msg" : err});
        res.status(500).json({ 
            message: "Error occured", 
        });
    }
}

const handleLogin = async (req,res) => {
    const { email, password } = req.body;
    try{
        const user = await userModel.findOne({email});
        //if not found
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }
        //password check
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Create JWT token
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name : user.name,
                balance : user.coins,
                phoneNo : user.phoneNo
                // Add any other user properties you want to include
            }
        });
    }catch(err){
        console.log({"msg" : err});
        res.status(500).json({ 
            message: "Error occured", 
        });
    }
}

const handleLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.log({"msg" : err});
        res.status(500).json({
            message: "Error occurred during logout",
        });
    }
}

const handleBalanceUpdate = async (req, res) => {
    try {
        // Check if user is authenticated using both session and JWT

        if (!req.cookies.jwt) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let userId;
        const decoded = jwt.verify(req.cookies.jwt, JWT_SECRET);
        console.log(decoded)
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        userId = decoded.userId;

        const { email, newBalance } = req.body;
        const user = await userModel.findOne({ _id: userId, email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.coins = newBalance;
        await user.save();

        res.status(200).json({
            message: "Balance updated successfully",
            newBalance: user.coins
        });
    } catch (err) {
        console.log({ "msg": err });
        res.status(500).json({ 
            message: "Error occurred during balance update",
        });
    }
};

module.exports = {
    handleSignup,handleLogin,handleLogout,handleBalanceUpdate
}