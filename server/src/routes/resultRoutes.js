import express from 'express';
import * as resultController from '../controllers/resultController.js';
import { authenticateUser, requireStudent, requireVerified } from '../middleware/auth.js';

const router = express.Router();

// Get results (admin can see all, students see their own)
router.get('/', authenticateUser, requireVerified, resultController.getResults);

// Get result by ID
router.get('/:id', authenticateUser, requireVerified, resultController.getResultById);

// Student - Submit exam
router.post('/submit', authenticateUser, requireStudent, requireVerified, resultController.submitExam);

// Student - Get my exam result
router.get('/exam/:examId', authenticateUser, requireStudent, requireVerified, resultController.getStudentExamResult);

export default router;
