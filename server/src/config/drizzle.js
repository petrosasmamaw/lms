import dotenv from 'dotenv'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL not set')

const pool = new Pool({ connectionString: DATABASE_URL })
const db = drizzle(pool)

export { db, pool }
export default db
