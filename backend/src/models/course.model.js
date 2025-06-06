import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  category: String,
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  coverImage: String,
  rating: {
    type: Number,
    default: 0,
  }, 
  quizzes: [{
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  }],
  practicePapers: [{
    type: Schema.Types.ObjectId,
    ref: "PracticePaper",
  }],
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note",
  }],
  forum: [{
    type: Schema.Types.ObjectId,
    ref: "ForumQuestion",
  }]
}, {
  timestamps: true,
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
