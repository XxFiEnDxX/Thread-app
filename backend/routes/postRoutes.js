import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost, replyPost, feedPost } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const postRoutes = express.Router();


postRoutes.get("/feed", protectRoute, feedPost)
postRoutes.get("/:id", getPost)
postRoutes.post("/create", protectRoute, createPost)
postRoutes.delete("/:id", protectRoute, deletePost)
postRoutes.post("/like/:id", protectRoute, likeUnlikePost);
postRoutes.post("/reply/:id", protectRoute, replyPost);

export default postRoutes;