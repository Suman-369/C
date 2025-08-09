const express = require("express")
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config()
const generateResponse = require("./src/services/ai.service");

const connectDB = require("./src/db/db");
connectDB()

const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:5173",
    }
});


const chatHistory = [
    // {
    //     role:"model",
    //     parts:[
    //         {
    //             text:"Who was The PM of INDIA in 2015"
    //         }
    //     ]

    // },
    // {
    //     role:"model",
    //     parts:[
    //         {
    //             text:"The Prime Minister of India in 2015 was **Narendra Modi**."
    //         }
    //     ]
    // }
]


io.on("connection", (socket) => {
    console.log("A user Connected")

    socket.on("disconnect",()=>{
        console.log("A User disconnect");
        
    })
    socket.on("clear-chat", () => {
        chatHistory.length = 0;
    })
    socket.on("ai-message",async(data)=>{
    
    console.log("recived : ",data);

    chatHistory.push({
        role:"user",
        parts:[{text:data}]
    })

    const response = await generateResponse(chatHistory)
    
    chatHistory.push({
        role:"model",
        parts:[{text:response}]
    })
    
    socket.emit("ai-message-response",{response})       
   })
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log("Server is Running on port", PORT);
});



//io = server
//socket = single user
//on = event listen 
//emit = event fire karna 

//built in event 
//  coutom event 