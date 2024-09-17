const {io} = require('../socket/socket')
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const { getRecieverSocketId } = require('../socket/socket');

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: convoId } = req.params;
        const senderId = req.user._id;

        // console.log(convoId,senderId)

        let convo = await Conversation.findOne({ _id: convoId });

        if (!convo) {
            return res.status(404).json({ msg: "Conversation not found" });
        }

        // Correct receiverId logic
        const receiverId = convo.participants.find(participant => participant.toString() !== senderId.toString());

        console.log(senderId,receiverId)
        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            conversationId: convoId, // You should link the message with the convoId
        });
        // Push the new message to the conversation
        convo.messages.push(newMessage._id);
        await convo.save();  // Save the updated conversation

        // Emit message to the receiver
        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        const n = await newMessage.populate(({
            path: 'senderId receiverId updatedAt', select: 'name email'
        }))

        res.status(201).json(n);
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ msg: "Error sending message" });
    }
};


const recieveMessage = async (req, res) => {
    try {
        const { id: convoId } = req.params;

        // Fetch the conversation first
        const convo = await Conversation.findOne({ _id: convoId });

        if (!convo) return res.status(200).json([]);

        // Populate messages with the proper conditions
        const populatedConvo = await Conversation.findOne({ _id: convoId })
            .populate({
                path: 'messages',
                match: {
                    $or: [
                        { senderId: { $in: convo.participants } },
                        { receiverId: { $in: convo.participants } }
                    ]
                }
            });

        const messages = populatedConvo.messages;
        res.status(200).json(messages);
      
    } catch (err) {
        console.error("Error fetching conversation messages:", err); // Log the error to console
        res.status(500).json({ message: "Error fetching messages" });
    }
};


  
  

module.exports = {sendMessage, recieveMessage};