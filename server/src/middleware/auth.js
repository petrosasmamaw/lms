import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function authenticateUser(req, res, next) {
  try {
    // Get session token from cookies
    const sessionToken = req.cookies['better-auth.session_token'];
    
    if (!sessionToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized - No session' });
    }

    // For now, get user from req.user if Better Auth middleware provides it
    // In production, you might want to verify the session token separately
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized - Invalid session' });
    }

    // Get user details from database
    const user = await db.query.users.findFirst({
      where: eq(users.userId, req.user.id),
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.userId = user.id;
    req.userRole = user.role;
    req.user = user;
    next();
  } catch (error) {
    console.error('[AUTH] Error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}

export function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden - Admin access required' });
  next();
}

export function isStudent(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Forbidden - Student access required' });
  next();
}

export function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
}
