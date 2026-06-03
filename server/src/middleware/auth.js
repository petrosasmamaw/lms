import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../config/auth.js';

export async function authenticateUser(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.user = session.user;
    req.userId = session.user.id;
    req.userRole = session.user.role;
    next();
  } catch (err) {
    console.error('[AUTH]', err);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden - admin only' });
  }
  next();
}

export function requireStudent(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Forbidden - students only' });
  }
  next();
}
