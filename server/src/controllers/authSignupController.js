import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../config/auth.js';
import {
  getUserByEmail,
  updateUserProfile,
  validateDepartment,
} from '../services/userService.js';
import { success, error } from '../utils/response.js';

function applyAuthCookies(res, authResponse) {
  const cookies = authResponse.headers.getSetCookie?.() || [];
  if (cookies.length) {
    cookies.forEach((cookie) => res.append('Set-Cookie', cookie));
  } else {
    const raw = authResponse.headers.get('set-cookie');
    if (raw) res.append('Set-Cookie', raw);
  }
}

export async function signupAdmin(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return error(res, 'Name, email, and password are required', 400);
    }

    const existing = await getUserByEmail(email);
    if (existing) return error(res, 'Email already taken', 409);

    const authResponse = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    if (!authResponse.ok) {
      const body = await authResponse.json();
      return error(res, body?.message || 'Sign up failed', authResponse.status);
    }

    const created = await getUserByEmail(email);
    if (created) {
      await updateUserProfile(created.id, {
        role: 'admin',
        verified: true,
        departmentId: null,
        year: null,
      });
    }

    const payload = await authResponse.json();
    applyAuthCookies(res, authResponse);
    const profile = await getUserByEmail(email);
    return res.status(authResponse.status).json({
      success: true,
      message: 'Admin account created',
      data: { user: profile, session: payload },
    });
  } catch (err) {
    console.error('signupAdmin', err);
    return error(res, 'Sign up failed', 500, err.message);
  }
}

export async function signupStudent(req, res) {
  try {
    const { name, email, password, departmentId, year } = req.body;
    if (!name || !email || !password || !departmentId || !year) {
      return error(res, 'Name, email, password, departmentId, and year are required', 400);
    }

    const yearNum = Number(year);
    if (![1, 2, 3, 4].includes(yearNum)) {
      return error(res, 'Year must be between 1 and 4', 400);
    }

    const deptOk = await validateDepartment(departmentId);
    if (!deptOk) return error(res, 'Invalid department', 400);

    const existing = await getUserByEmail(email);
    if (existing) return error(res, 'Email already taken', 409);

    const authResponse = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    if (!authResponse.ok) {
      const body = await authResponse.json();
      return error(res, body?.message || 'Sign up failed', authResponse.status);
    }

    const created = await getUserByEmail(email);
    if (created) {
      await updateUserProfile(created.id, {
        role: 'student',
        verified: false,
        departmentId: Number(departmentId),
        year: yearNum,
      });
    }

    const payload = await authResponse.json();
    applyAuthCookies(res, authResponse);
    const profile = await getUserByEmail(email);
    return res.status(authResponse.status).json({
      success: true,
      message: 'Student account created. An administrator must verify your account before you can access courses.',
      data: { user: profile, session: payload },
    });
  } catch (err) {
    console.error('signupStudent', err);
    return error(res, 'Sign up failed', 500, err.message);
  }
}
