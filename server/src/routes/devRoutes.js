import express from 'express'
import { pool } from '../config/drizzle.js'

const router = express.Router()

// Dev-only: validate session by x-session-token header
router.get('/validate-session', async (req, res) => {
  const token = req.get('x-session-token') || req.query.token
  if (!token) return res.status(400).json({ success: false, message: 'Missing x-session-token header or token query' })
  const client = await pool.connect()
  try {
    const s = await client.query('SELECT * FROM session WHERE token = $1', [token])
    if (!s.rows.length) return res.status(404).json({ success: false, message: 'Session not found' })
    const session = s.rows[0]
    const u = await client.query('SELECT id, name, email, email_verified, image, created_at FROM "user" WHERE id = $1', [session.user_id])
    if (!u.rows.length) return res.status(404).json({ success: false, message: 'User not found' })
    const user = u.rows[0]
    return res.json({ success: true, session, user })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'DB error', error: String(err) })
  } finally {
    client.release()
  }
})

export default router
