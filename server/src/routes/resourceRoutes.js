import express from 'express'
import multer from 'multer'
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js'
import * as resCtrl from '../controllers/resourceController.js'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/', authenticateUser, authorizeAdmin, upload.single('file'), resCtrl.uploadResource)
router.get('/', authenticateUser, resCtrl.listResources)
router.delete('/:id', authenticateUser, authorizeAdmin, resCtrl.deleteResource)

export default router
