import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { getAllowedOrigins } from './allowedOrigins.js';

const baseURL = process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 5001}`;
const isProduction = process.env.NODE_ENV === 'production' || process.env.BETTER_AUTH_URL?.includes('https');

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: getAllowedOrigins(),
  sessionExpiresIn: 60 * 60 * 24 * 7, // 7 days
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    useSecureCookies: isProduction, // Use secure cookies in production
    disableCSRFCheck: false,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'student',
        input: false,
      },
      departmentId: {
        type: 'number',
        required: false,
        input: false,
      },
      year: {
        type: 'number',
        required: false,
        input: false,
      },
      verified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    requireEmailVerification: false,
  },
});

export default auth;
