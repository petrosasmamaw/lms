import express from 'express';
import { authenticateUser, requireAdmin, requireStudent } from '../middleware/auth.js';
import {
  getMyPaymentRecords,
  getStudentPaymentRecords,
  patchPaymentStatus,
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/me', authenticateUser, requireStudent, getMyPaymentRecords);
router.get('/student/:studentId', authenticateUser, requireAdmin, getStudentPaymentRecords);
router.patch('/:id', authenticateUser, requireAdmin, patchPaymentStatus);

export default router;
