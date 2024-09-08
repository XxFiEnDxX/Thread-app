import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getMessages, sendMessage, getConversations } from "../controllers/messageController.js";

const messageRoutes = express.Router()

messageRoutes.get("/conversations",protectRoute, getConversations);
messageRoutes.get("/:otherUserId",protectRoute, getMessages);
messageRoutes.post("/",protectRoute, sendMessage);

export default messageRoutes;