import express from 'express'
import multer from 'multer'
import { authenticateUser, requireAdmin } from '../middleware/auth.js'
import * as resCtrl from '../controllers/resourceController.js'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/', authenticateUser, requireAdmin, upload.single('file'), resCtrl.uploadResource)
router.get('/', authenticateUser, resCtrl.listResources)
router.delete('/:id', authenticateUser, requireAdmin, resCtrl.deleteResource)

export default router
