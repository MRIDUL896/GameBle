const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Users'
        }
    ],
    messages : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Message',
            default : []
        }
    ]
},{timestamps : true});

module.exports = mongoose.model("Conversation",conversationSchema);