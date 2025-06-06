import express from 'express';
import { saveMessage, getChatHistory, clearHistory } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/message', saveMessage);
router.get('/history/:userId', getChatHistory);
router.delete('/clear/:userId', clearHistory);

export default router;
 