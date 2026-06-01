import { registerSchema, loginSchema } from '../validators/authValidator.js'
import { success, error } from '../utils/response.js'

// These legacy endpoints are disabled when Better Auth is enabled.
// Clients should use the Better Auth endpoints mounted at `/api/auth`.
export async function register(req, res, next) {
  return error(res, 'Use Better Auth routes at /api/auth to register', 501)
}

export async function login(req, res, next) {
  return error(res, 'Use Better Auth routes at /api/auth to login', 501)
}

export async function current(req, res, next) {
  try {
    const user = req.user
    if (!user) return error(res, 'Not authenticated', 401)
    return success(res, { user }, 'Current user')
  } catch (err) {
    next(err)
  }
}
