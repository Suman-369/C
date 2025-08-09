const express = require("express")
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config()
const genarateResponse = require("./src/services/ai.service");

const connectDB = require("./src/db/db");
const { log } = require("console");
connectDB()

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("A user Connected")

    socket.on("disconnect",()=>{
        console.log("A User disconnect");
        
    })
   socket.on("ai-message",async(data)=>{
 
    const response = await genarateResponse(data.prompt)

    console.log("Ai Response: ",response);

    socket.emit("ai-message-response",{response})
        
   })
});


httpServer.listen(3000,()=>{
    console.log("Server is Running on port 3000");
    
})
