import mongoose from "mongoose";

const forumAnswerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumQuestion",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ForumAnswer = mongoose.model("ForumAnswer", forumAnswerSchema);
export default ForumAnswer;
/*const forumQuestions = await ForumQuestion.find({ course: courseId })
  .populate("author", "username")
  .populate({
    path: "answers",
    populate: {
      path: "author",
      select: "username role"
    }
  });
 */