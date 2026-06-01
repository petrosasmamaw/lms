import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment')
}

const pool = new Pool({ connectionString: DATABASE_URL })

export async function query(text, params) {
  return pool.query(text, params)
}

export default pool
