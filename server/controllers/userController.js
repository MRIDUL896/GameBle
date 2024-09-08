const pswdStrength = require('../middlewaares/passwordStrength');
const bcrypt = require('bcrypt');
const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const generateTokenAndSetCookie = require('../utils/generateToken');
const generateFriendCode = require('../utils/generateFriendCode');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
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
            if (newUser) {
                // Generate JWT token here
                generateTokenAndSetCookie(newUser._id, res);
                const code = generateFriendCode(newUser._id);

                newUser.friendCode = code;

                await newUser.save();
    
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    profilePic: newUser.profilePic,
                    friendCode : newUser.friendCode
                });
            } else {
                res.status(400).json({ error: "Invalid user data" });
            }
        }
    }catch(err){
        res.status(500).json({ 
            message: "Error occured", 
        });
    }
};

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
                phoneNo : user.phoneNo,
                friends : user.friends,
                friendCode : user.friendCode,
                incomingFriendRequests : user.incomingFriendRequests,
                pendingFriendRequests : user.pendingFriendRequests
                // Add any other user properties you want to include
            }
        });
    }catch(err){
        res.status(500).json({ 
            message: "Error occured", 
        });
    }
};

const handleLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Error occurred during logout",
        });
    }
};

const handleBalanceUpdate = async (req, res) => {
    try {
        // Check if user is authenticated using both session and JWT

        if (!req.cookies.jwt) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let userId;
        const decoded = jwt.verify(req.cookies.jwt, JWT_SECRET);
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
        res.status(500).json({ 
            message: "Error occurred during balance update",
        });
    }
};

const getUsersForSidebar = async (req, res) => {
	try {
		const userId = req.user._id;
		const userWithFriends = await userModel.findById(userId).populate('friends', 'name email phoneNo'); // Specify which fields of friends you want to retrieve
        const friends = userWithFriends.friends;
        if(friends.length ==0 || !friends){
            return res.status(200).json({});
        }
		res.status(200).json(friends);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const sendFriendRequest = async (req, res) => {
    try {
        const { friendCode } = req.body; // The friend code of the user to send the request to
        const senderId = req.user._id; // The user sending the request

        // Find the user by the friend code
        const recipient = await userModel.findOne({ friendCode });
        if (!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if they are already friends
        if (recipient.friends.includes(senderId)) {
            return res.status(400).json({ message: "You are already friends" });
        }

        // Check if a friend request has already been sent
        if (recipient.incomingFriendRequests.includes(senderId) || recipient.pendingFriendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Add to recipient's incoming requests and sender's pending requests
        recipient.incomingFriendRequests.push(senderId);
        const sender = await userModel.findById(senderId);
        sender.pendingFriendRequests.push(recipient._id);

        await Promise.all([await recipient.save(),await sender.save()]);

        res.status(200).json({ message: "Friend request sent" });

    } catch (err) {
        res.status(500).json({ message: "Error sending friend request", error: err });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body; // ID of the user whose friend request is being accepted
        const userId = req.user._id; // The user accepting the request

        // Find both users
        const user = await userModel.findById(userId);
        const requester = await userModel.findById(requestId);

        if (!user || !requester) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the request exists
        if (!user.incomingFriendRequests.includes(requestId)) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // Add each other to the friends list
        user.friends.push(requestId);
        requester.friends.push(userId);

        // Remove the request from incoming and pending lists
        user.incomingFriendRequests = user.incomingFriendRequests.filter(req => req.toString() !== requestId);
        requester.pendingFriendRequests = requester.pendingFriendRequests.filter(req => req.toString() !== userId);

        Promise.all([await user.save(),await requester.save()])

        res.status(200).json({ message: "Friend request accepted" });
        
    } catch (err) {
        res.status(500).json({ message: "Error accepting friend request", error: err });
    }
};

const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await conversationModel.find({ participants: userId })
            .populate({
                path: 'participants',
                select: 'name email phoneNo'
            })
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 }
            })
            .sort({ 'messages.createdAt': -1 });

        const result = conversations.map(conversation => {
            const latestMessage = conversation.messages[0];
            const otherParticipant = conversation.participants.find(p => p._id.toString() !== userId.toString());

            return {
                conversationId: conversation._id,
                participant: otherParticipant,
                latestMessage: latestMessage ? {
                    message: latestMessage.message,
                    senderId: latestMessage.senderId,
                    createdAt: latestMessage.createdAt
                } : null
            };
        });

        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching conversations:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const incomingFriendRequests = async(req,res) => {
    const userId = req.user._id;
	const requests = await userModel.findById(userId).populate('incomingFriendRequests', 'name email phoneNo');
    if(requests.length ==0 || !requests){
        return res.status(200).json({});
    }
    res.status(200).json(requests);
}

module.exports = {
    handleSignup,handleLogin,handleLogout,handleBalanceUpdate,getUsersForSidebar,sendFriendRequest,acceptFriendRequest,getConversations,incomingFriendRequests
}