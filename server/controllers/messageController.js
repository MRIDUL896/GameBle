const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');

const sendMessage = async (req,res) => {
    try{
        const {message} = req.body;
        const { id : convoId} = req.params;
        const senderId = req.user._id;

        let convo = await Conversation.findOne({
            _id : convoId
        })


        const receiverId = convo.participants[0] === senderId ? convo.participants[1] : convo.participants[1];

        if(!convo){
            console.log("err");
            res.json({msg : "err"})
            convo = await Conversation.create({
                participants : [senderId , receiverId]
            }).catch((err) => {
                res.status(404).json({msg : "could not perform the action"})
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            convo.messages.push(newMessage._id);
        }

        await Promise.all([convo.save(),newMessage.save()]);

        // Socket implemeted here

        res.status(201).json({message : "message sent successfully"});

    }catch(err){
        res.status(500).json({ "msg" : "error" });
    }
}

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