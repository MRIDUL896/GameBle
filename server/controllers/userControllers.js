const pswdStrength = require('../middlewaares/passwordStrength')
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const saltRound = 10;

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
            res.status(201).json({ 
                message: "User created successfully", 
                userId: newUser._id 
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
        //success
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name : user.name,
                balance : user.coins
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
        // If you're using server-side sessions, you might clear the session here
        // req.session.destroy();

        // If you're using tokens, you typically don't need to do anything server-side
        // The client should delete the token

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.log({"msg" : err});
        res.status(500).json({
            message: "Error occurred during logout",
        });
    }
}

const handleBalanceUpdate = async (req,res) => {
    try{
        const {email , newBalance} = req.body;
        const user = await userModel.findOne({email});
        user.coins = newBalance;
        await user.save();
        res.status(200).json({
            message: "Balance updated successfully",
            newBalance: user.coins
        });
    }catch(err){
        console.log({"msg" : err});
        res.status(500).json({
            message: "Error occurred during logout",
        });
    }
}

module.exports = {
    handleSignup,handleLogin,handleLogout,handleBalanceUpdate
}