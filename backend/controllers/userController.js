import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";


const getUserProfile = async(req, res)=>{
    try {
        const username = req.params.username;
        const user = await User.findOne({username}).select("-password -updatedAt");
        

        if(!user){
            return res.status(400).json({"message": "User not found!"});
        }
        return res.status(200).json({user});

    } catch (error) {
        console.log("Error in getUserProfile", error.message);
        return res.status(500).json({message: error.message});
    }
}

const signupUser = async(req, res)=>{
    try {
        const {name, email, username, password} = req.body;  //express.json()
        const user = await User.findOne({$or:[{email},{username}]});
        
        if(user){
            return res.status(400).json({"message": "User Already Created! 💢"})
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
            })
        }else{
            return res.status(400).json({"message": "Invaild User data!❌"})
        }
    } catch (error) {
        console.log("Error in signupUser ", error.message);
        res.status(500).json({message: error.message})
        
    }
}

const loginUser = async(req, res)=>{
    try {
        const {username, password} = req.body;
        
        const user = await User.findOne({username});
        
        if(!user){
            return res.status(400).send("Invaild Username!👎")
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({"message":"Your Password is Incorrect!🥲"})
        }
        
        // generate JWT token
        await generateTokenAndSetCookies(user._id, res);

        return res.status(200).json({
            username: user.username,
            _id: user._id,
            email: user.email,
            name: user.name,
        })
    } catch (error) {
        console.log("Error in loginUser ", error.message);
        res.status(500).json({message: error.message});
    }
    
}

const logoutUser = async(req, res)=>{
    try {
        res.cookie("jwt","",{maxAge: 1})
        // res.status(200).json({"message": "User logged out successfully! ✅"})
        res.status(200).clearCookie("jwt").json({"message": "User Logout successfully!✅"})
    } catch (error) {
        console.log("Error in logoutUser ", error.message);
        res.status(500).json({message: error.message});
    }
}

const followUnFollowUsers = async(req, res)=>{
    try {
        const {id} = req.params;
        
        const userToModify = await User.findById(id);
        const curUser = await User.findById(req.user._id);
        
        if(id === req.user._id.toString()){
            return res.status(400).json({message: "cant follow yourself"});
        }
        if(!userToModify || !curUser){
            return res.status(400).json({message: "Your not found!"});
        }
        
        const isFollowing = curUser.following.includes(id);
        
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}})
            return res.status(200).json({message: "User unfollow!"});
        }else{
            // follow
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id} })
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id} })
            return res.status(200).json({message: "User follow!"});
        }
        
    } catch (error) {
        console.log("Error in followUnFollowUsers ", error.message);
        return res.status(500).json({message: error.message});
    }
}

const updateUser = async(req, res)=>{
    try {

        const {name, email, username, password, profilePic, bio} = req.body
        const userId = req.user._id; 

        if(req.params.id !== userId.toString()){
            return res.status(400).json({"message":"Cant update other user's profiles."})
        }
        
        let user = await User.findById(userId);
        
        if(!user){
            return res.status(500).json({"message":"User Not Found"})
        }
        
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        
        user = await user.save();
        
        return res.status(200).json({"message":"Profile update successfully!✅"});  

    } catch (error) {
        console.log("Error in updateUser ", error.message);
        return res.status(500).json({message: error.message});
    }
}



export {signupUser, loginUser, logoutUser, followUnFollowUsers, updateUser, getUserProfile}