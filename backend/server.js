import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import {v2 as cloudinary} from "cloudinary";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB() // DB connection
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

app.get('/', (req, res)=>{
    res.send("/ Route is Working! 🐈")
})

app.listen(PORT, ()=>console.log(`server is listening to PORT: ${PORT} 😺`));