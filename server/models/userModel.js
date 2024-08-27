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
    coins : {
        type : Number,
        default : 100
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Users',userSchema);