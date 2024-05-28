const mongoose = require("mongoose");

const dbConnect = async () => {
 
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDb connected");
    }
    catch(error){
       console.log("ERROR",error);
       process.exit();
    }

}

module.exports = dbConnect;
