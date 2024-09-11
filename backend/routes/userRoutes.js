import express from "express";
import { loginUser, signupUser, logoutUser, followUnFollowUsers, updateUser, getUserProfile, getSuggestedUsers, freezeAccount } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
protectRoute

const userRoutes = express.Router();

userRoutes.get("/profile/:query", getUserProfile);
userRoutes.get("/suggested", protectRoute, getSuggestedUsers);
userRoutes.post("/signup", signupUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);
userRoutes.post("/follow/:id", protectRoute ,followUnFollowUsers);
userRoutes.put("/update/:id", protectRoute ,updateUser);
userRoutes.put("/freeze", protectRoute, freezeAccount);

export default userRoutes;