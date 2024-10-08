const pswdStrength = require('../middlewaares/passwordStrength');
const bcrypt = require('bcrypt');
const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const generateTokenAndSetCookie = require('../utils/generateToken');
const generateFriendCode = require('../utils/generateFriendCode');
const { getRecieverSocketId } = require('../socket/socket');
const {io} = require('../socket/socket')

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const saltRound = 10;

const test = (req,res) => {
    res.json({msg : "test success"})
}

const handleSignup = async (req , res) => {
    let user = req.body;
    try {
        const pswd = user.password;
        const email = user.email;
        const existing = await userModel.findOne({email});
        if(existing){
            return res.json({message : "user already registered"})
        }
        // if(pswdStrength(pswd) == "weak"){
        //     return res.json({ message: "password too weak" });
        // }
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
                    friendCode : newUser.friendCode,
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
    console.log("the cookies are",req.cookies)
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
        console.log("hi",req.cookies.jwt)
		const userId = req.user._id;
		const userWithFriends = await userModel.findById(userId).populate('friends', 'name email phoneNo'); // Specify which fields of friends you want to retrieve
        const friends = userWithFriends.friends;
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
            return res.status(200).json({ message: "Friend request already sent" });
        }

        // Add to recipient's incoming requests and sender's pending requests
        recipient.incomingFriendRequests.push(senderId);
        const sender = await userModel.findById(senderId);
        sender.pendingFriendRequests.push(recipient._id);

        await Promise.all([await recipient.save(),await sender.save()]);

        // Emit message to the receiver
        const receiverSocketId = getRecieverSocketId(recipient._id);
        let newRequest = {
            _id : recipient._id,
            name : recipient.name,
            email : recipient.email,
            phoneNo : recipient.phoneNo
        }
        // console.log("i am here",receiverSocketId)
        // console.lo
        if (receiverSocketId) {
            // console.log("fine")
            io.to(receiverSocketId).emit("newRequest", newRequest);
            // console.log("ending")
        }

        res.status(200).json({ message: "Friend request sent" });

    } catch (err) {
        res.status(500).json({ message: "Error sending friend request", error: err });
    }
};

const getUserConversations = async (req, res) => {
    try {
        const userId = req.user._id; // The logged-in user's ID

        // Find all conversations where the user is a participant
        const conversations = await conversationModel.find({
            participants: userId
        }).populate({
            path: 'participants',
            // select: 'name, _id',  // Only select the name of participants
            match: { _id: { $ne: userId } }  // Only return the other user (not the logged-in user)
        }).populate({
            path: 'messages',
            select: 'content createdAt',  // Select message content and timestamp
        });

        if (!conversations.length) {
            return res.status(404).json({ message: "No conversations found" });
        }

        // Format the response to include only the necessary details
        const conversationList = conversations.map(convo => {
            const otherUser = convo.participants.find(participant => participant._id.toString() !== userId);
            return {
                conversationId: convo._id,
                otherUserId : otherUser ? otherUser._id : "",
                otherUser: otherUser ? otherUser.name : "Unknown",  // Handle cases where the other user is not found
                messages: convo.messages.map(message => ({
                    messageId: message._id,
                    content: message.content,
                    timestamp: message.createdAt,
                })),
                updatedAt: convo.updatedAt 
            };
        });

        res.status(200).json(conversationList);

    } catch (err) {
        res.status(500).json({ message: "Error fetching conversations", error: err });
    }
};


const findConversation = async (req, res) => {
    try {
        const convoId = req.params.id;

        // Find the conversation and populate the messages
        const conversation = await conversationModel.findOne({
            _id: convoId
        }).populate({
            path: 'messages',  // Populate the messages
            populate: { path: 'senderId receiverId updatedAt', select: 'name email' }  // Optionally, populate sender and receiver details
        });

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found between the two users" });
        }

        // Send conversation details along with messages
        res.status(200).json(conversation);

    } catch (err) {
        res.status(500).json({ message: "Error fetching conversation", error: err });
    }
};



const acceptFriendRequest = async (req, res) => {
    try {
        const requestId = req.body.id; // ID of the user whose friend request is being accepted
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
        requester.pendingFriendRequests = requester.pendingFriendRequests.filter(req => {
            return !req.equals(userId);
        });

        // Create a new conversation between the participants (user and requester)
        const conversation = await conversationModel.create({
            participants: [userId, requestId]
        });

        // Add the conversation ID to both the user and requester's `convers` array
        user.convers.push(conversation._id);
        requester.convers.push(conversation._id);

        // Save both users and the conversation in parallel
        await Promise.all([user.save(), requester.save()]);
        res.status(200).json(conversation);
        
    } catch (err) {
        res.status(500).json({ message: "Error accepting friend request", error: err });
    }
};


const incomingFriendRequests = async(req,res) => {
    try{
        const userId = req.user._id;
        const requests = await userModel.findById(userId).populate('incomingFriendRequests', 'name email phoneNo');
        if(requests.length ==0 || !requests){
            return res.status(200).json({});
        }
        res.status(200).json(requests.incomingFriendRequests);
    }catch (err) {
        res.status(500).json({ message: "Error occured", error: err });
    }
}

const pendingFriendRequests = async(req,res) => {
    try{
        const userId = req.user._id;
        const requests = await userModel.findById(userId).populate('pendingFriendRequests', 'name email phoneNo');
        if(requests.length ==0 || !requests){
            return res.status(200).json({});
        }
        res.status(200).json(requests.pendingFriendRequests);
    }catch(err){
        res.status(500).json({ message: "Error occured", error: err });
    }
}

const getInfo = async (req,res) => {
    try{
        const {id : userInfoId} = req.params;
        const user = await userModel.findOne({_id : userInfoId});
        if(!user) return res.status(404).json({ message: "Not found", error: err });
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({ message: "Error occured", error: err });
    }
}

module.exports = {
    handleSignup,handleLogin,handleLogout,handleBalanceUpdate,getUsersForSidebar,sendFriendRequest,acceptFriendRequest,incomingFriendRequests,
    pendingFriendRequests, findConversation, getUserConversations,getInfo,test
}