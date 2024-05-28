const asyncHandler=require("express-async-handler");
const Message =require("../models/messageModels");
const User=require("../models/userModel");
const Chat=require("../models/chatModels");

const createMessage = asyncHandler(async(req,res)=>{

   const {content,chatId} =req.body
   if(!content || !chatId){
         
    console.log("Invalid data passed into request");
       return res.status(400);
   }

   try{

       const newMessage={
        sender:req.user._id, 
        content:content,
        chat:chatId,
       };
    
       var msg=await Message.create(newMessage);

       msg=await msg.populate("sender","name profilePic");
       msg=await msg.populate("chat");
       msg= await User.populate(msg,{
        path:"chat.users",
        select:"name profilePic email"
       });

       await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:msg});

       res.json(msg);

   }
   catch(error){
    res.status(400);
    throw new Error(error.message);
   }




});

const allMessage = asyncHandler(async(req,res)=>{

    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name profilePic email")
          .populate("chat");
        res.json(messages);
      } 
      catch (error) {
        res.status(400);
        throw new Error(error.message);
      }

});

module.exports={createMessage,allMessage};
