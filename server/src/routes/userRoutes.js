import express from 'express';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { listUsers, toggleStudentVerified } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authenticateUser, requireAdmin, listUsers);
router.patch('/:id/verified', authenticateUser, requireAdmin, toggleStudentVerified);

export default router;
