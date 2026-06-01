import express from 'express';
import * as questionController from '../controllers/questionController.js';
import { isAdmin, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get questions
router.get('/', questionController.getQuestions);

// Get question by ID
router.get('/:id', questionController.getQuestionById);

// Admin only - Create question
router.post('/', authenticateUser, isAdmin, questionController.createQuestion);

// Admin only - Update question
router.put('/:id', authenticateUser, isAdmin, questionController.updateQuestion);

// Admin only - Delete question
router.delete('/:id', authenticateUser, isAdmin, questionController.deleteQuestion);

export default router;
