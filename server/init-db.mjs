import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('🗑️  Dropping old user tables...');
    await client.query('DROP TABLE IF EXISTS "user" CASCADE');
    await client.query('DROP TABLE IF EXISTS session CASCADE');
    await client.query('DROP TABLE IF EXISTS account CASCADE');
    await client.query('DROP TABLE IF EXISTS verification CASCADE');
    
    console.log('✅ Old tables dropped');
    console.log('Better Auth will create new tables automatically on first signup');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
