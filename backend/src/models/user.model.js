import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },

    // Only used if role === "teacher"
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // Assumes you have a Course model
      },
    ],

    // Only used if role === "student"
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
 