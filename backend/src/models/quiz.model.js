import mongoose from "mongoose";

const { Schema } = mongoose;

// 📌 Subdocument: Individual Question
const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: String,
  },
  { _id: false }
);

// 📘 Main Quiz Schema
const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [questionSchema],

    // 🔢 New: Track total number of attempts
    totalAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
