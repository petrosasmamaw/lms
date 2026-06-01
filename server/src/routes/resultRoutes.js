import express from 'express';
import * as resultController from '../controllers/resultController.js';
import { authenticateUser, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Get results (admin can see all, students see their own)
router.get('/', authenticateUser, resultController.getResults);

// Get result by ID
router.get('/:id', authenticateUser, resultController.getResultById);

// Student - Submit exam
router.post('/submit', authenticateUser, isStudent, resultController.submitExam);

// Student - Get my exam result
router.get('/exam/:examId', authenticateUser, isStudent, resultController.getStudentExamResult);

export default router;
