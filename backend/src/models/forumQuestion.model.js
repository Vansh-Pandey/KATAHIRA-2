import mongoose from "mongoose";

const forumQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ForumAnswer",
      },
    ],
  },
  { timestamps: true }
);

const ForumQuestion = mongoose.model("ForumQuestion", forumQuestionSchema);
export default ForumQuestion;
