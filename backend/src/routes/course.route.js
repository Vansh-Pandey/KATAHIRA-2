import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  addQuizToCourse,
  addNoteToCourse,
  addPracticePaperToCourse,
  addForumQuestionToCourse,
  addAnswerToForumQuestion,
  addQuestionToQuiz
} from "../controllers/course.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", protectRoute, createCourse);
router.post("/enroll/:id", protectRoute, enrollInCourse);
router.post("/:id/quizzes", protectRoute, addQuizToCourse);
router.post("/:courseId/forum", protectRoute, addForumQuestionToCourse);
router.post("/:id/notes", protectRoute, addNoteToCourse);
router.post("/:courseId/practice-papers", protectRoute, addPracticePaperToCourse);
router.post("/forum/:questionId/answers", protectRoute, addAnswerToForumQuestion);
router.post("/:courseId/quizzes/:quizId/questions",protectRoute,addQuestionToQuiz);
export default router;
