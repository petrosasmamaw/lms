import express from 'express'
import * as deptCtrl from '../controllers/departmentController.js'
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public departments list (no auth required)
router.get('/public', deptCtrl.listDepartments)
router.get('/', authenticateUser, deptCtrl.listDepartments)
router.post('/', authenticateUser, authorizeAdmin, deptCtrl.createDepartment)
router.get('/:id', authenticateUser, deptCtrl.getDepartment)
router.put('/:id', authenticateUser, authorizeAdmin, deptCtrl.updateDepartment)
router.delete('/:id', authenticateUser, authorizeAdmin, deptCtrl.deleteDepartment)

export default router
