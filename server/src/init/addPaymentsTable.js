import { config } from 'dotenv';
import { Pool } from 'pg';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon')
    ? { rejectUnauthorized: false }
    : process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_payments (
        id SERIAL PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
        status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
        amount NUMERIC(10, 2),
        screenshot_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (student_id, year, month)
      );
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS student_payments_student_year_month_idx
      ON student_payments (student_id, year, month);
    `);
    console.log('✅ student_payments table ready');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
