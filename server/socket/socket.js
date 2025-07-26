const  { Server } =  require("socket.io");
const http = require('http');
const express = require('express')

const app = express();

const frontend = process.env.FRONTENDURL ? process.env.FRONTENDURL : "http://localhost:3000";
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:[frontend],
        methods:["GET","POST","PUT","DELETE"],
        credentials: true
    }
});

const getRecieverSocketId = (recieverId) => {
    return userSocketMap[recieverId];
}

const userSocketMap = {    // {user_id : socket_id}

}

io.on("connection",(socket) => {
    // console.log("user connected");

    const userId = socket.handshake.query.userId;

    if(userId != "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        // console.log("user disconnected,",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

module.exports = {app,io,server,getRecieverSocketId};