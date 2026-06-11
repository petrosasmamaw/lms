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
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;
    `);
    await pool.query(`
      UPDATE "user" SET verified = true WHERE role = 'admin';
    `);
    console.log('✅ verified column added (or already exists)');
    console.log('✅ existing admin accounts marked as verified');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
