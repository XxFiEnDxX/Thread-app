import { Server } from "socket.io";
import http from 'http'
import express from 'express'
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express()
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods:["GET", "POST"]
    }
})

const userSocketMap = {} // userId : socketId
export const getRecipientSocketId = (recipientId) => (userSocketMap[recipientId]);


io.on('connection', (socket)=>{
    console.log("user Connected", socket.id);

    // When your connect's
    const userId = socket.handshake.query.userId;
    if(userId != "undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // send all the keys of this hashmap in te form of an array

    socket.on("markMessageAsSeen", async({conversationId, userId})=>{
        try {
            await Message.updateMany({conversationId:conversationId, seen:false},{$set:{seen:true}})
            await Conversation.updateOne({_id: conversationId}, {$set:{"lastMessage.seen":true} })
            io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId})
        } catch (error) {
            console.log(error);
        }
    })
    
    // When your disconnect's
    socket.on('disconnect', ()=>{
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // send all the keys of this hashmap in te form of an array
    })
})

export {io, server, app}