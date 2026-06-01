import { pool } from '../config/drizzle.js'
import { getAuth, isEnabled } from '../config/betterAuth.js'
import crypto from 'crypto'

async function seed() {
  const client = await pool.connect()
  try {
    const userId = crypto.randomUUID()
    const sessionId = crypto.randomUUID()
    const token = crypto.randomBytes(32).toString('hex')
    const now = new Date()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    await client.query('BEGIN')
    await client.query(
      'INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$6)',
      [userId, 'Seeded User', `seed+${Date.now()}@example.com`, true, null, now]
    )

    await client.query(
      'INSERT INTO session (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ($1,$2,$3,$4,$4,$5,$6,$7)',
      [sessionId, expiresAt, token, now, '127.0.0.1', 'seed-script', userId]
    )

    await client.query('COMMIT')
    console.log('Seeded userId, sessionId, token:', { userId, sessionId, token })

    // probe auth handler with common headers
    const auth = getAuth()
    if (!isEnabled() || !auth || !auth.handler) {
      console.warn('Auth not enabled or handler missing; seeded DB only.')
      process.exit(0)
    }

    const variants = [
      { name: 'Authorization Bearer', headers: { Authorization: `Bearer ${token}` } },
      { name: 'x-session-token', headers: { 'x-session-token': token } },
      { name: 'cookie: session_token', headers: { Cookie: `session_token=${token}` } },
      { name: 'cookie: ba.session', headers: { Cookie: `ba.session=${token}` } },
      { name: 'cookie: __Host-session', headers: { Cookie: `__Host-session=${token}` } },
      { name: 'cookie: session', headers: { Cookie: `session=${token}` } },
    ]

    for (const v of variants) {
      try {
        const req = new Request('http://localhost/api/auth/session', { method: 'GET', headers: v.headers })
        const res = await auth.handler(req)
        console.log(v.name, 'status', res.status)
        try {
          const txt = await res.text()
          console.log('body:', txt.slice(0, 500))
        } catch (e) {}
        if (res.status === 200) break
      } catch (e) {
        console.error('handler probe error', e)
      }

        const sessionPaths = [
          '/api/auth/get-session',
          '/api/auth/getSession',
          '/api/auth/session/get',
          '/api/auth/session/get-session',
          '/api/auth/get-session',
          '/api/auth/getsession'
        ]

        for (const p of sessionPaths) {
          for (const v of variants) {
            try {
              const req = new Request(`http://localhost${p}`, { method: 'GET', headers: v.headers })
              const res = await auth.handler(req)
              console.log('Probe', p, v.name, 'status', res.status)
              const txt = await res.text()
              console.log('body:', txt.slice(0, 300))
              if (res.status === 200) break
            } catch (e) {
              console.error('probe error', e)
            }
          }
        }
    }

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Seed error', err)
  } finally {
    client.release()
    process.exit(0)
  }
}

seed()
