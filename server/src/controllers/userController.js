import { listStudents } from '../services/userService.js';
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
