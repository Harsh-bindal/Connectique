const express = require("express")
const {protect} =require("../middleware/usersMiddleware")
const {createMessage,allMessage} =require("../controllers/messageControllers");

const router=express.Router();


router.post("/",protect,createMessage);
router.get("/:chatId",protect,allMessage);


module.exports = router;
