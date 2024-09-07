const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');

const sendMessage = async (req,res) => {
    try{
        const {message} = req.body;
        const { id : recieverId} = req.params;
        const senderId = req.user._id;
        
        let convo = await Conversation.findOne({
            participants : {$all : [senderId , recieverId]}
        })

        if(!convo){
            convo = await Conversation.create({
                participants : [senderId , recieverId]
            });
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
        });

        if(newMessage){
            convo.messages.push(newMessage._id);
        }

        await Promise.all([convo.save(),newMessage.save()]);

        //Socket implemeted here

        res.status(201).json({message : "message sent successfully"});

    }catch(err){
        res.status(500).json({ "msg" : "erroe" });
    }
}

const recieveMessage = async (req,res) => {
    try{
        const {id : recieverId} = req.params;
        const senderId = req.user._id;

        let convo = await Conversation.findOne({
            participants : {$all : [senderId, recieverId]},
        }).populate("messages"); //not gives refrence but messages

        if(!convo) return res.status(200).json([]);

        const messages = convo.messages;
        res.status(200).json(messages);

    }catch(err){
        res.status(500).json({message : err});
    }
}

module.exports = {sendMessage, recieveMessage};