const express = require("express")
const app = express()
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("Welcome to the Chat Application")
})


module.exports = app