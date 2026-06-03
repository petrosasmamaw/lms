import { config } from 'dotenv';

config();

export default {
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  // drizzle-kit expects a 'dialect' value like 'postgresql'|'mysql'|'sqlite'
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
