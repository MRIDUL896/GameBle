const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type :  String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    phoneNo: {
        type: String,
        required: true,
        // validate: {
        //     validator: function(v) {
        //         return /\d{10}/.test(v);  // Example validation for a 10-digit number
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        // }
    },
    coins : {
        type : Number,
        default : 100
    },
    friends : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            default : []
        }
    ],
    friendCode: {
        type: String,
        unique: true,
    },
    incomingFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    pendingFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    convers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Conversation',
            default : []
        }
    ]
},{
    timestamps : true
});

module.exports = mongoose.model('User',userSchema);