import { listStudents, getUserById, updateUserProfile } from '../services/userService.js';
import { success, error } from '../utils/response.js';

export async function listUsers(req, res) {
  try {
    const { role, departmentId, year } = req.query;

    if (role === 'student') {
      const students = await listStudents({ departmentId, year });
      return success(res, { users: students }, 'Students retrieved');
    }

    return error(res, 'Unsupported query. Use role=student', 400);
  } catch (err) {
    return error(res, 'Failed to list users', 500, err.message);
  }
}

export async function toggleStudentVerified(req, res) {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    if (typeof verified !== 'boolean') {
      return error(res, 'verified must be a boolean', 400);
    }

    const existing = await getUserById(id);
    if (!existing) return error(res, 'User not found', 404);
    if (existing.role !== 'student') {
      return error(res, 'Only student accounts can be verified', 400);
    }

    const updated = await updateUserProfile(id, { verified });
    return success(res, { user: updated }, verified ? 'Student verified' : 'Student unverified');
  } catch (err) {
    return error(res, 'Failed to update verification', 500, err.message);
  }
}
