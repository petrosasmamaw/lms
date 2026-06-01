import dotenv from 'dotenv'
dotenv.config()

import { getAuth, isEnabled } from '../config/betterAuth.js'

async function run() {
  if (!isEnabled()) {
    console.log('Better Auth not enabled; skipping migrations')
    return
  }
  const auth = getAuth()
  if (!auth) {
    console.error('Better Auth instance not ready')
    process.exit(1)
  }
  if (typeof auth.runMigrations !== 'function') {
    console.log('No runMigrations available on Better Auth instance')
    return
  }
  try {
    console.log('Running Better Auth migrations...')
    await auth.runMigrations()
    console.log('Better Auth migrations complete')
  } catch (err) {
    console.error('Migration error', err)
    process.exit(1)
  }
}

run()
