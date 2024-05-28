const mongoose = require("mongoose");

//chatname
//isAdmin
//latestMessage
//isGroupChat
//Users
//time stamp

const chatModelSchema = new mongoose.Schema({
    
    chatName : {type: String, trim : true},
    
    isGroupChat  : {type : Boolean, default: false},
    
    isAdmin :{type : mongoose.Schema.Types.ObjectId , ref : "User"},
    
    latestMessage : {type : mongoose.Schema.Types.ObjectId, ref : "Message"},

    users: [ {type: mongoose.Schema.Types.ObjectId , ref:"User" } ],

    
}, {timestamps : true}) ;

 const Chat= mongoose.model("Chat",chatModelSchema);
 module.exports = Chat;