
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies?.jwt;

        if(!token){
            return res.status(400).json({"message":"No jwt In The Cookies!🍪"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute ", error.message);
        return res.status(500).json({message: error.message});
    }
}

export default protectRoute