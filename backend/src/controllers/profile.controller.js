import mongoose from "mongoose";
import User from "../models/user.model.js";
import Course from "../models/course.model.js"; // Assuming you have a Course model

/**
 * Get the authenticated user's profile with additional course data
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: req.user.role === 'teacher' ? 'createdCourses' : 'enrolledCourses',
        select: 'title description imageUrl'
      });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      courses: req.user.role === 'teacher' ? user.createdCourses : user.enrolledCourses
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Check if username already exists
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Username already taken." });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({ 
      error: error.message || "Internal server error." 
    });
  }
};

/**
 * Get user courses based on role
 */
export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const courses = await Course.find({
      _id: { $in: user.role === 'teacher' ? 
        user.createdCourses : user.enrolledCourses 
      }
    }).select('title description imageUrl duration instructor');

    return res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching user courses:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};