import { registerSchema } from '../validators/authValidator.js'
import { success, error } from '../utils/response.js'
import { authenticateUser } from '../middleware/auth.js'
import * as authService from '../services/authService.js'
import bcrypt from 'bcryptjs'

export async function createAppUser(req, res, next) {
  try {
    const sessionUser = req.user
    if (!sessionUser) return error(res, 'Not authenticated', 401)

    const payload = registerSchema.parse(req.body)
    // ensure unique email / student id
    const existing = await authService.findUserByEmail(payload.email)
    if (existing) return error(res, 'Email already registered', 409)
    if (payload.student_id) {
      const bySid = await authService.findUserByStudentId(payload.student_id)
      if (bySid) return error(res, 'Student ID already registered', 409)
    }

    // hash password for local record (Better Auth stores real credentials)
    const hashed = await bcrypt.hash(payload.password, 10)

    const created = await authService.createUser({
      name: payload.name,
      email: payload.email,
      password: hashed,
      role: payload.role,
      department_id: payload.department_id ? Number(payload.department_id) : null,
      student_id: payload.student_id || null,
    })

    return success(res, { user: created }, 'App user created', 201)
  } catch (err) {
    next(err)
  }
}

export async function getCurrentAppUser(req, res, next) {
  try {
    const sessionUser = req.user
    if (!sessionUser) return error(res, 'Not authenticated', 401)
    const user = await authService.findUserByEmail(sessionUser.email)
    if (!user) return error(res, 'User not found', 404)
    return success(res, { user }, 'Current app user')
  } catch (err) {
    next(err)
  }
}
