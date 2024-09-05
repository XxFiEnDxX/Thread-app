import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost, replyPost, feedPost, getUserPost } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const postRoutes = express.Router();


postRoutes.get("/feed", protectRoute, feedPost)
postRoutes.get("/:id", getPost)
postRoutes.get("/user/:username", getUserPost)
postRoutes.post("/create", protectRoute, createPost)
postRoutes.delete("/:id", protectRoute, deletePost)
postRoutes.put("/like/:id", protectRoute, likeUnlikePost);
postRoutes.put("/reply/:id", protectRoute, replyPost);

export default postRoutes;