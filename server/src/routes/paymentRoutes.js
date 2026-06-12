import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateUser, requireAdmin, requireStudent } from '../middleware/auth.js';
import {
  getMyPaymentRecords,
  getStudentPaymentRecords,
  patchPaymentStatus,
  getPaymentConfig,
  submitPayment,
} from '../controllers/paymentController.js';

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const unique = `payment-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const screenshotUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only JPG, PNG, or WEBP screenshots are allowed'));
  },
});

const router = express.Router();

router.get('/config', authenticateUser, getPaymentConfig);
router.get('/me', authenticateUser, requireStudent, getMyPaymentRecords);
router.get('/student/:studentId', authenticateUser, requireAdmin, getStudentPaymentRecords);
router.post('/:id/submit', authenticateUser, requireStudent, screenshotUpload.single('screenshot'), submitPayment);
router.patch('/:id', authenticateUser, requireAdmin, patchPaymentStatus);

export default router;
