import express from 'express';
import * as examController from '../controllers/examController.js';
import { authenticateUser, requireAdmin, requireStudent } from '../middleware/auth.js';

const router = express.Router();

router.get('/', examController.getExams);
router.post('/', authenticateUser, requireAdmin, examController.createExam);

router.get('/:examId/questions', authenticateUser, examController.getExamQuestions);
router.get('/:examId/attempt', authenticateUser, requireStudent, examController.getExamAttempt);
router.post('/:examId/questions', authenticateUser, requireAdmin, examController.addExamQuestion);
router.post('/:examId/submit', authenticateUser, requireStudent, examController.submitExam);

router.get('/:id', examController.getExamById);
router.put('/:id', authenticateUser, requireAdmin, examController.updateExam);
router.delete('/:id', authenticateUser, requireAdmin, examController.deleteExam);

export default router;
