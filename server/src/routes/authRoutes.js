import express from 'express'
import { register, login, current } from '../controllers/authController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/current', authenticateUser, current)

export default router
