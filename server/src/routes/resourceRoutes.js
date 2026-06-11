import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateUser, requireAdmin, requireVerified } from '../middleware/auth.js';
import * as resCtrl from '../controllers/resourceController.js';
import { isAllowedResourceFile } from '../utils/cloudinaryDelivery.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (isAllowedResourceFile(file.originalname)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only PDF, DOC, DOCX, MP4, MOV, and WEBM files are allowed'));
  },
});

const router = express.Router();

router.post('/', authenticateUser, requireAdmin, upload.single('file'), resCtrl.uploadResource);
router.get('/', authenticateUser, requireVerified, resCtrl.listResources);
router.delete('/:id', authenticateUser, requireAdmin, resCtrl.deleteResource);

export default router;
