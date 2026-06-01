import dotenv from 'dotenv'
import drizzle, { db as drizzleDb } from './src/config/drizzle.js'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth/minimal'

dotenv.config()

// Provide the drizzle DB instance to the adapter
const adapter = drizzleAdapter(drizzleDb, { provider: 'pg' })

const auth = betterAuth({
  database: adapter,
  plugins: [],
  rateLimit: { storage: 'database' }
})

export default auth
