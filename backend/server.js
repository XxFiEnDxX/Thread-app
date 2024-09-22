import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import {app,server} from './socket/socket.js'

import {v2 as cloudinary} from "cloudinary";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB() // DB connection
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    console.log("hello");

    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    });
}


// app.get('/', (req, res)=>{
//     res.send("/ Route is Working! 🐈")
// })

server.listen(PORT, ()=>console.log(`server is listening to PORT: ${PORT} 😺`));