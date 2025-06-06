import express from "express";
import { 
  updateProfile, 
  getProfile,
  getUserCourses // Added new controller
} from "../controllers/profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user profile
router.get("/", protectRoute, getProfile);

// Update profile
router.patch("/update", protectRoute, updateProfile);

// Get user courses (enrolled or created based on role)
router.get("/courses", protectRoute, getUserCourses);

export default router;