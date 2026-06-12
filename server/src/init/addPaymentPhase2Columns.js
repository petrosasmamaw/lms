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
      ALTER TABLE student_payments
        ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
        ADD COLUMN IF NOT EXISTS tx_code VARCHAR(100),
        ADD COLUMN IF NOT EXISTS sender_name TEXT,
        ADD COLUMN IF NOT EXISTS sender_account TEXT,
        ADD COLUMN IF NOT EXISTS receiver_name TEXT,
        ADD COLUMN IF NOT EXISTS receiver_account TEXT,
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
        ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS student_payments_tx_code_unique_idx
      ON student_payments (tx_code)
      WHERE tx_code IS NOT NULL;
    `);

    console.log('✅ Payment phase 2 columns ready');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
