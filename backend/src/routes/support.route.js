
import express from 'express';
import {
  getAllQuestions,
  postQuestion,
  addAnswer,
  toggleLikeAnswer,
} from '../controllers/support.controller.js';

const router = express.Router();

router.get('/', getAllQuestions);
router.post('/', postQuestion);
router.post('/:questionId/answer', addAnswer);
router.post('/:questionId/answer/:answerId/like', toggleLikeAnswer);

export default router;
