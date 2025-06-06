import mongoose from "mongoose";

const practicePaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    fileUrl: {
      type: String,
      required: true, // Link to PDF or uploaded file
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Only teachers should upload
    },

    
  },
  { timestamps: true }
);

const PracticePaper = mongoose.model("PracticePaper", practicePaperSchema);
export default PracticePaper;
/*
const papers = await PracticePaper.find({ course: courseId })
  .populate("uploadedBy", "username")
  .sort({ createdAt: -1 });
*/ 