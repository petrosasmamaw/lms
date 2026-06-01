import express from 'express'
import * as deptCtrl from '../controllers/departmentController.js'
import { authenticateUser, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public departments list (no auth required)
router.get('/public', deptCtrl.getDepartments)
router.get('/', deptCtrl.getDepartments)
router.post('/', authenticateUser, requireAdmin, deptCtrl.createDepartment)
router.get('/:id', deptCtrl.getDepartment)
router.put('/:id', authenticateUser, requireAdmin, deptCtrl.updateDepartment)
router.delete('/:id', authenticateUser, requireAdmin, deptCtrl.deleteDepartment)

export default router
