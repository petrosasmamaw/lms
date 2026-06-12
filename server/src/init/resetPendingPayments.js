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
    const result = await pool.query(`
      UPDATE student_payments
      SET
        status = 'unpaid',
        amount = NULL,
        payment_method = NULL,
        tx_code = NULL,
        sender_name = NULL,
        sender_account = NULL,
        receiver_name = NULL,
        receiver_account = NULL,
        screenshot_url = NULL,
        rejection_reason = NULL,
        submitted_at = NULL,
        updated_at = NOW()
      WHERE status IN ('pending', 'unpaid')
        AND (tx_code IS NOT NULL OR screenshot_url IS NOT NULL OR rejection_reason IS NOT NULL);
    `);
    console.log(`✅ Cleared ${result.rowCount} incomplete payment submission(s)`);
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
