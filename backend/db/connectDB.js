import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DataBase Connected! 📚`);
        
    } catch (error) {
        console.error(`DB ERROR: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;