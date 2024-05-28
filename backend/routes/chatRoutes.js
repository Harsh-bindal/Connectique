const express= require("express");
const {creatChat,fetchChats,createChatGroup,renameGroup,addGroup,removeFromGroup} =require("../controllers/chatsController");
const router=express.Router();
const {protect}= require("../middleware/usersMiddleware")


router.post("/",protect,creatChat);
router.get("/",protect,fetchChats);
router.post("/group",protect,createChatGroup);
router.put("/removeFromGroup",protect,removeFromGroup);
router.put("/renameGroup",protect,renameGroup);
router.put("/addGroup",protect,addGroup);

module.exports=router;