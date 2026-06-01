import express from 'express';
import * as examController from '../controllers/examController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get exams
router.get('/', examController.getExams);

// Get exam by ID
router.get('/:id', examController.getExamById);

// Admin only - Create exam
router.post('/', authenticateUser, requireAdmin, examController.createExam);

// Admin only - Update exam
router.put('/:id', authenticateUser, requireAdmin, examController.updateExam);

// Admin only - Delete exam
router.delete('/:id', authenticateUser, requireAdmin, examController.deleteExam);

export default router;
