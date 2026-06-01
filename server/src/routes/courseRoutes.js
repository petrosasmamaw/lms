import express from 'express'
import * as courseCtrl from '../controllers/courseController.js'
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateUser, courseCtrl.listCourses)
router.post('/', authenticateUser, authorizeAdmin, courseCtrl.createCourse)
router.get('/:id', authenticateUser, courseCtrl.getCourse)
router.put('/:id', authenticateUser, authorizeAdmin, courseCtrl.updateCourse)
router.delete('/:id', authenticateUser, authorizeAdmin, courseCtrl.deleteCourse)

export default router
