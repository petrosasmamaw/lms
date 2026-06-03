import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { listUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authenticateUser, listUsers);

export default router;
