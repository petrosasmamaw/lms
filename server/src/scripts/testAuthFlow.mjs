import { getAuth, isEnabled } from '../config/betterAuth.js'
import { pool } from '../config/drizzle.js'

if (!isEnabled()) {
  console.log('Better Auth not enabled')
  process.exit(0)
}

const auth = getAuth()

async function tryRequest(path, method='GET', body) {
  const url = `http://localhost${path}`
  const headers = { 'content-type': 'application/json' }
  const req = new Request(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  try {
    const res = await auth.handler(req)
    const text = await res.text()
    let json
    try { json = JSON.parse(text) } catch (e) { json = text }
    return { status: res.status, body: json }
  } catch (err) {
    return { error: String(err) }
  }
}

async function queryTables() {
  const client = await pool.connect()
  try {
    const u = await client.query('SELECT id, email, name, created_at FROM "user" ORDER BY created_at DESC LIMIT 5')
    const s = await client.query('SELECT id, token, user_id, created_at FROM session ORDER BY created_at DESC LIMIT 5')
    return { users: u.rows, sessions: s.rows }
  } finally {
    client.release()
  }
}

(async function(){
  console.log('Starting test flow')
  // try sign up email variants
  const testEmail = `cli-test+${Date.now()}@example.com`
  const password = 'TestPass123!'
  const candidates = [
    { path: '/api/auth/sign-up/email', method: 'POST', body: { email: testEmail, password } },
    { path: '/api/auth/sign-up-email', method: 'POST', body: { email: testEmail, password } },
    { path: '/api/auth/sign-up', method: 'POST', body: { email: testEmail, password, name: 'CLI Tester' } },
    { path: '/api/auth/signin/email', method: 'POST', body: { email: testEmail, password } },
    { path: '/api/auth/sign-in/email', method: 'POST', body: { email: testEmail, password } },
    { path: '/api/auth/signin', method: 'POST', body: { email: testEmail, password } },
    { path: '/api/auth/sign-in', method: 'POST', body: { email: testEmail, password } },
    { path: '/api/auth/signUpEmail', method: 'POST', body: { email: testEmail, password } },
    { path: '/sign-up/email', method: 'POST', body: { email: testEmail, password } },
  ]

  for (const c of candidates) {
    console.log('\nTrying', c.path)
    const res = await tryRequest(c.path, c.method, c.body)
    console.log('Result:', res)
    if (res && res.status && res.status >= 200 && res.status < 300) break
  }

  // Try sign-up with name (required by validation)
  console.log('\nTrying explicit sign-up with name')
  const explicit = await tryRequest('/api/auth/sign-up/email', 'POST', { name: 'CLI Tester', email: testEmail, password })
  console.log('Explicit sign-up result:', explicit)

  // try get session
  console.log('\nTrying get session')
  const gs = await tryRequest('/api/auth/session')
  console.log('session get:', gs)

  // query DB
  const tables = await queryTables()
  console.log('\nDB users:', tables.users)
  console.log('DB sessions:', tables.sessions)

  process.exit(0)
})()
