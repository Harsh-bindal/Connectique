
const express =require("express");
const router=express.Router();
const {protect} =require("../middleware/usersMiddleware");
const {registration,authUser,allUsers} = require("../controllers/userController");



router.route("/").post(registration).get(protect,allUsers);
router.post("/login",authUser);

module.exports= router;