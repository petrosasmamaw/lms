import { query } from '../config/db.js'

export async function findUserByEmail(email) {
  const res = await query('SELECT * FROM users WHERE email = $1', [email])
  return res.rows[0]
}

export async function findUserByStudentId(studentId) {
  const res = await query('SELECT * FROM users WHERE student_id = $1', [studentId])
  return res.rows[0]
}

export async function createUser({ name, email, password, role, department_id = null, student_id = null }) {
  const res = await query(
    `INSERT INTO users (name, email, password, role, department_id, student_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [name, email, password, role, department_id, student_id]
  )
  return res.rows[0]
}

export async function getUserById(id) {
  const res = await query('SELECT * FROM users WHERE id = $1', [id])
  return res.rows[0]
}
