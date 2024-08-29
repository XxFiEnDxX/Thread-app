import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB() // DB connection
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get('/', (req, res)=>{
    res.send("/ Route is Working! 🐈")
})

app.listen(PORT, ()=>console.log(`server is listening to PORT: ${PORT} 😺`));