import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";


const getUserProfile = async(req, res)=>{
    const query = req.params.query;
    try {
        let user;
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({ _id: query }).select("-password -updatedAt");
        }
        else{
            user = await User.findOne({ username: query }).select("-password -updatedAt");
        }
        
        if(!user){
            return res.status(400).json({error: "User not found!"});
        }
        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const signupUser = async(req, res)=>{
    try {
        const {name, email, username, password} = req.body;  //express.json()
        const user = await User.findOne({$or:[{email},{username}]});
        
        if(user){
            return res.status(400).json({error: "User Already Created! 💢"})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const newUser = await new User({name, email, username, password:hashedPassword});
        await newUser.save();

        if(newUser){
            const token = await generateTokenAndSetCookies(newUser._id, res);
            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            })
        }else{
            return res.status(400).json({error: "Invaild User data!❌"})
        }
    } catch (error) {
        res.status(500).json({"error": error.message})
    }
}

const loginUser = async(req, res)=>{
    try {
        const {username, password} = req.body;
        
        const user = await User.findOne({username});
        
        if(!user){
            return res.status(400).json({error:"Invaild Username!👎"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({error:"Your Password is Incorrect!🥲"})
        }

        if(user.isFrozen){
            user.isFrozen = false;
            await user.save();
        }
        
        // generate JWT token
        await generateTokenAndSetCookies(user._id, res);

        return res.status(200).json({
            username: user.username,
            _id: user._id,
            email: user.email,
            name: user.name,
            bio: user.bio,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in loginUser ", error.message);
        res.status(500).json({error: error.message});
    }
    
}

const logoutUser = async(req, res)=>{
    try {
        res.cookie("jwt","",{maxAge: 1})
        // res.status(200).json({"message": "User logged out successfully! ✅"})
        res.status(200).clearCookie("jwt").json({"message": "User Logout successfully!✅"})
    } catch (error) {
        console.log("Error in logoutUser ", error.message);
        res.status(500).json({error: error.message});
    }
}

const followUnFollowUsers = async(req, res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({error: "undefined user id"});
        }
        
        const userToModify = await User.findById(id);
        const curUser = await User.findById(req.user._id);
        
        if(id === req.user._id.toString()){
            return res.status(400).json({error: "cant follow yourself"});
        }
        if(!userToModify || !curUser){
            return res.status(400).json({error: "Your not found!"});
        }
        
        const isFollowing = curUser.following.includes(id);
        
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}})
            return res.status(200).json({message: "User unfollowed!🙄"});
        }else{
            // follow
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id} })
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id} })
            return res.status(200).json({message: "User followed!😊"});
        }
        
    } catch (error) {
        console.log("Error in followUnFollowUsers ", error.message);
        return res.status(500).json({error: error.message});
    }
}

const updateUser = async(req, res)=>{
    try {

        const {name, email, username, password, bio} = req.body
        let {profilePic} = req.body;

        const userId = req.user._id; 
        if(req.params.id !== userId.toString()){
            return res.status(400).json({error:"Cant update other user's profiles."})
        }
        
        let user = await User.findById(userId);
        
        if(!user){
            return res.status(500).json({error:"User Not Found"})
        }
        
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }

        if(profilePic){
            if(user?.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        
        user = await user.save();

        // find all post with this user replies and update username and userProfilepic fields
        await Post.updateMany(
            {"replies.userId" : userId},
            {
                $set:{
                    "replies.$[reply].username":user.username,
                    "replies.$[reply].userProfilePic":user.profilePic
                }
            },
            {
                arrayFilters:[{"reply.userId":userId}]
            }
        )

        user.password = null 
        
        return res.status(200).json(user);  

    } catch (error) {
        console.log("Error in updateUser ", error.message);
        return res.status(500).json({error: error.message});
    }
}

const getSearchedUsers = async(req, res) => {
    try {
        const {input} = req.query;

        // const similarUsers = await User.findOne({ username: input }).select("name username profilePic");
        const similarUsers = await User.find({
            $or: [
              { username: { $regex: input, $options: 'i' } },
              { name: { $regex: input, $options: 'i' } }
            ]
          }).select("name username profilePic")

        if(!similarUsers){
            return res.status(400).json({error: "User Not Found!"})
        }

        return res.status(200).send(similarUsers);
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const getSuggestedUsers = async(req, res)=>{
    try {
        const userId = req.user._id

        const userFollowings = await User.findById(userId).select("following");
        
        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne: userId},
                }
            },
            {
                $sample:{
                    size: 10,
                } 
            }
        ])
        const filteredUsers = users.filter(user => !userFollowings.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user=>user.password=null)

        res.status(200).json(suggestedUsers);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const freezeAccount = async(req, res)=>{
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({error: "User Not Found!"});
        }

        user.isFrozen = true;
        await user.save();

        res.status(200).json({messages: "success!"})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export {signupUser, loginUser, logoutUser, followUnFollowUsers, updateUser, getUserProfile, getSearchedUsers, getSuggestedUsers, freezeAccount}