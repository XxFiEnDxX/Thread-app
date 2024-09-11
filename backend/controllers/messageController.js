import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { getRecipientSocketId, io } from "../socket/socket.js";


async function sendMessage(req, res) {
    try {
        const {recipientId, message} = req.body;
        const senderId = req.user._id;
        let {image} = req.body;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, recipientId]},
        });
        
        if(!conversation){
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
            await conversation.save();
        }

        if(image){
            const imgRes = await cloudinary.uploader.upload(image)
            image = imgRes.secure_url;
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            image: image || "",
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
        ])
        
        const recipientSocketId = getRecipientSocketId(recipientId);
        if(recipientSocketId){
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


async function getMessages(req, res) {
    const {otherUserId} = req.params;
    const userId = req.user._id;
    try {
        if(!mongoose.Types.ObjectId.isValid(otherUserId)){
            return res.json(400).json({error: "Conversation not found!"})
        }
        let conversation = await Conversation.findOne({
            participants: {$all: [userId, otherUserId]},
        });

        if(!conversation){
            return res.json(400).json({error: "Conversation not found!"})
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({createdAt: 1})

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({error: "something in getMessages route"});
    }
}

async function getConversations(req, res) {
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username profilePic",
        });

        conversations.forEach(conversation=>{
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString() !== userId.toString()
            );
        })

        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export {sendMessage, getMessages, getConversations}