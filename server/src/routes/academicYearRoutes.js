import express from 'express';
import * as academicYearController from '../controllers/academicYearController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get academic years
router.get('/', academicYearController.getAcademicYears);

// Get academic year by ID
router.get('/:id', academicYearController.getAcademicYearById);

// Admin only - Create academic year
router.post('/', authenticateUser, requireAdmin, academicYearController.createAcademicYear);

// Admin only - Update academic year
router.put('/:id', authenticateUser, requireAdmin, academicYearController.updateAcademicYear);

// Admin only - Delete academic year
router.delete('/:id', authenticateUser, requireAdmin, academicYearController.deleteAcademicYear);

export default router;
