import express from 'express';
import * as questionController from '../controllers/questionController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get questions
router.get('/', questionController.getQuestions);

// Get question by ID
router.get('/:id', questionController.getQuestionById);

// Admin only - Create question
router.post('/', authenticateUser, requireAdmin, questionController.createQuestion);

// Admin only - Update question
router.put('/:id', authenticateUser, requireAdmin, questionController.updateQuestion);

// Admin only - Delete question
router.delete('/:id', authenticateUser, requireAdmin, questionController.deleteQuestion);

export default router;
