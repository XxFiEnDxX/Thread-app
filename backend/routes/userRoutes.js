import express from "express";
import { loginUser, signupUser, logoutUser, followUnFollowUsers, updateUser, getUserProfile } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
protectRoute

const userRoutes = express.Router();

userRoutes.get("/profile/:username", getUserProfile);
userRoutes.post("/signup", signupUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);
userRoutes.post("/follow/:id", protectRoute ,followUnFollowUsers);
userRoutes.post("/update/:id", protectRoute ,updateUser);

export default userRoutes;