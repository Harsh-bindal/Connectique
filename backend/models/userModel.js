const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


//name
//email
//password
//profilePic
//timestamp

const userModelSchema = new mongoose.Schema({

    name: {type:String, required: true},

    email: {type:String, required: true,unique:true},

    password : {type: String, required : true},

    profilePic : {type: String, default : "https://thumbs.dreamstime.com/b/user-profile-icon-vector-avatar-person-picture-portrait-symbol-neutral-gender-silhouette-circle-button-photo-blank-272664038.jpg"}

  

},{timestamps :  true});

userModelSchema.methods.matchPassword = async function (enteredPassword){
       
    return await bcrypt.compare(enteredPassword,this.password);
};

userModelSchema.pre('save',async function (next){

    if(!this.isModified){
        next();
    }
     
    const salt= await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});




const User = mongoose.model("User",userModelSchema);
module.exports = User;