import express from "express";
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} from "../controllers/authController.js";
import { 
  googleAuth, 
  facebookAuth, 
  linkSocialAccount, 
  unlinkSocialAccount 
} from "../controllers/socialAuthController.js";
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfileImage, 
  changePassword, 
  deleteAccount 
} from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadProfileImage as uploadMiddleware, handleUploadError } from "../middleware/upload.js";

const authRouter = express.Router();

// Public routes (no authentication required)
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

// Social authentication routes
authRouter.post("/google", googleAuth);
authRouter.post("/facebook", facebookAuth);

// Protected routes (authentication required)
authRouter.use(authMiddleware); // Apply auth middleware to all routes below

// Profile management
authRouter.get("/profile", getUserProfile);
authRouter.put("/profile", updateUserProfile);
authRouter.post("/profile/image", uploadMiddleware, handleUploadError, uploadProfileImage);
authRouter.put("/change-password", changePassword);
authRouter.delete("/account", deleteAccount);

// Social account linking
authRouter.post("/link-social", linkSocialAccount);
authRouter.post("/unlink-social", unlinkSocialAccount);

export default authRouter;
