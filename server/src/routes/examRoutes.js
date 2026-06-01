import express from 'express';
import * as examController from '../controllers/examController.js';
import { isAdmin, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get exams
router.get('/', examController.getExams);

// Get exam by ID
router.get('/:id', examController.getExamById);

// Admin only - Create exam
router.post('/', authenticateUser, isAdmin, examController.createExam);

// Admin only - Update exam
router.put('/:id', authenticateUser, isAdmin, examController.updateExam);

// Admin only - Delete exam
router.delete('/:id', authenticateUser, isAdmin, examController.deleteExam);

export default router;
