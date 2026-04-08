import express from "express";
import { getCurrentUser, getUserProfile, loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multerUpload from "../config/multer.js";
  // ADD THIS

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// 🔥 THIS IS THE IMPORTANT LINE
userRouter.get("/me", protect, getCurrentUser);
userRouter.get('/profile', protect, getUserProfile);
userRouter.put('/profile', protect, multerUpload.single('image'), updateUserProfile);
userRouter.post("/logout",protect, logoutUser);

export default userRouter;
