import express from 'express'

import * as appAuthCtrl from '../controllers/appAuthController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Require Better Auth session for these endpoints
router.post('/', authenticateUser, appAuthCtrl.createAppUser)
router.get('/me', authenticateUser, appAuthCtrl.getCurrentAppUser)

export default router
