import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async(req, res)=>{
    try {
        const {postedBy, text, img} = req.body;

        if(!postedBy){
            return res.status(400).json({"message":"postedBy required!"})
        }
        
        if(!(text || img)){
            return res.status(400).json({"message":"either text or img required!"}) 
        }
        
        const user = await User.findById(postedBy);
        if(!user){
            return res.status(400).json({"message":"User not found!"}) 
        }
        
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(400).json({"message":"unauthorized user!"}) 
        }
        
        if(text.length > 500){
            return res.status(400).json({"message":"text too long!"}) 
        }

        const newPost = new Post({postedBy, text, img})
        await newPost.save();

        return res.status(200).json({ "message": "posted successfully!", post: newPost})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getPost = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({message: "Post Not Found!"})
        }

        return res.status(200).json({post})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const feedPost = async(req, res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({message: "User Not Found!😵"})
        }
        
        const following = user.following
        const feed = await Post.find({postedBy:{$in:following}}).sort({createdAt: -1});
        
        return res.status(200).json(feed)
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const replyPost = async(req, res)=>{
    try {
        const postId = req.params.id

        const {text} = req.body

        const userId = req.user._id
        const profilePic = req.user.profilePic
        const username = req.user.username

        if(!text){
            return res.status(200).json({message: "Reply is required!😾"})
        }

        const post = await Post.findById(postId)
        
        const reply = {userId, text, profilePic, username}

        post.replies.push(reply)
        await post.save()

        return res.status(200).json({message: "Reply added Successfully!✅",post:post})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const likeUnlikePost = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({message: "Post Not Found!"})
        }
        
        const isLiked = post.likes.includes(req.user._id);

        if(isLiked){
            // unlike
            await Post.findByIdAndUpdate(req.params.id, {$pull:{likes:req.user._id}})
            return res.status(200).json({message:"Post Unliked!✅"})
        }else{
            // like
            post.likes.push(req.user._id);
            await post.save();

            return res.status(200).json({message:"Post Liked!✅"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deletePost = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({message: "Post Not Found!😵"})
        }
        
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(404).json({message: "Unauthorized User!💢"})
        }
        
        const jobDone = await Post.findByIdAndDelete(req.params.id)

        if(!jobDone){
            return res.status(500).json({message: "Not Able To Delete The Post!🤯"})
        }
        
        return res.status(200).json({message: "Post Deleted Successfully!✅"})

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export {createPost, getPost, deletePost, likeUnlikePost, replyPost, feedPost}