import express from 'express'
import * as courseCtrl from '../controllers/courseController.js'
import { authenticateUser, requireAdmin, requireVerified } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateUser, requireVerified, courseCtrl.listCourses)
router.post('/', authenticateUser, requireAdmin, courseCtrl.createCourse)
router.get('/:id', authenticateUser, requireVerified, courseCtrl.getCourse)
router.put('/:id', authenticateUser, requireAdmin, courseCtrl.updateCourse)
router.delete('/:id', authenticateUser, requireAdmin, courseCtrl.deleteCourse)

export default router
