import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createTables() {
  const client = await pool.connect();
  try {
    console.log('Creating Better Auth schema...');

    // Create user table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" VARCHAR(255) PRIMARY KEY NOT NULL,
        "name" VARCHAR(255),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "emailVerified" BOOLEAN DEFAULT false,
        "image" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ User table created');

    // Create session table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" VARCHAR(255) PRIMARY KEY NOT NULL,
        "token" VARCHAR(255) UNIQUE NOT NULL,
        "userId" VARCHAR(255) NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "ipAddress" VARCHAR(255),
        "userAgent" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Session table created');

    // Create account table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" VARCHAR(255) PRIMARY KEY NOT NULL,
        "accountId" VARCHAR(255) NOT NULL,
        "providerId" VARCHAR(255) NOT NULL,
        "userId" VARCHAR(255) NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
        "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
        "scope" VARCHAR(255),
        "password" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("providerId", "accountId")
      );
    `);
    console.log('✅ Account table created');

    // Create verification table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" VARCHAR(255) PRIMARY KEY NOT NULL,
        "identifier" VARCHAR(255) NOT NULL,
        "value" VARCHAR(255) NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("identifier", "value")
      );
    `);
    console.log('✅ Verification table created');

    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
