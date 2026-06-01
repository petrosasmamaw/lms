import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [],
  trustedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    process.env.CLIENT_URL,
  ],
  baseURL: process.env.BETTER_AUTH_URL,
});

export default auth;
