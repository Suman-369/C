const mongoose = require("mongoose")


function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Database Connected Successfully");
    })

    .catch((err)=>{
        console.error("Database Connection Failed:", err);
    })
}

module.exports = connectDB