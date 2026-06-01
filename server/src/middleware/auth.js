import { db } from '../db/index.js';
import { users, session } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Authenticate by reading Better Auth session token cookie and resolving user
export async function authenticateUser(req, res, next) {
  try {
    const sessionToken = req.cookies['better-auth.session_token'] || req.cookies['better-auth.session'];
    if (!sessionToken) return res.status(401).json({ success: false, message: 'Unauthorized - no session' });

    // Look up session in DB
    const found = await db.select().from(session).where(eq(session.token, sessionToken)).limit(1);
    const s = found && found[0];
    if (!s) return res.status(401).json({ success: false, message: 'Unauthorized - session not found' });

    // Look up user by auth id
    const u = await db.select().from(users).where(eq(users.authUserId, s.userId)).limit(1);
    const user = u && u[0];
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch (err) {
    console.error('[AUTH] error', err);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden - admin only' });
  next();
}

export function requireStudent(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Forbidden - students only' });
  next();
}

export function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
}
