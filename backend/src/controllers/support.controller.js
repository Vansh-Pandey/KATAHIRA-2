// backend/controllers/support.controller.js
import SupportQuestion from '../models/supportQuestion.model.js';

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await SupportQuestion.find()
    .sort({ createdAt: -1 })
    .populate('answers.authorId', 'username email'); ;
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// Post a new question
export const postQuestion = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Title, content and author are required' });
    }

    const newQuestion = new SupportQuestion({ 
      title, 
      content, 
      author, 
      tags: tags || [] 
    });
    
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add answer to a question
export const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { authorId, content } = req.body;

    if (!authorId || !content) {
      return res.status(400).json({ message: 'Author ID and content are required' });
    }

    const question = await SupportQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.answers.push({ authorId, content, likes: [] });
    await question.save();

    await question.populate({
      path: 'answers.authorId',
      select: 'username email'
    });

    const populatedAnswer = question.answers[question.answers.length - 1];

    res.status(200).json({
      ...populatedAnswer.toObject(),
      likedByUser: false,
      likesCount: 0
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Like/unlike an answer
export const toggleLikeAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const question = await SupportQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const index = answer.likes.indexOf(userId);
    if (index === -1) {
      answer.likes.push(userId);
    } else {
      answer.likes.splice(index, 1);
    }

    await question.save();
    res.status(200).json({ 
      likes: answer.likes.length,
      likedByUser: index === -1 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
