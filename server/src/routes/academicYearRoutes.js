import express from 'express';
import * as academicYearController from '../controllers/academicYearController.js';
import { isAdmin, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get academic years
router.get('/', academicYearController.getAcademicYears);

// Get academic year by ID
router.get('/:id', academicYearController.getAcademicYearById);

// Admin only - Create academic year
router.post('/', authenticateUser, isAdmin, academicYearController.createAcademicYear);

// Admin only - Update academic year
router.put('/:id', authenticateUser, isAdmin, academicYearController.updateAcademicYear);

// Admin only - Delete academic year
router.delete('/:id', authenticateUser, isAdmin, academicYearController.deleteAcademicYear);

export default router;
