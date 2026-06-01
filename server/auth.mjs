import { betterAuth } from "better-auth";
import { toNodeHandler } from "better-auth/node";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🔐 Loading Better Auth from auth.mjs");

const connectionString = process.env.DATABASE_URL;
const authBaseURL = process.env.BETTER_AUTH_URL || "http://localhost:5001/api/auth";
const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn("BETTER_AUTH_SECRET is not set. Set it in server/.env");
}

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Better Auth");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

console.log("✅ Better Auth initialized successfully from auth.mjs");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseURL,
  trustedOrigins: [authBaseURL, "http://localhost:5173", "http://localhost:3000"],
  useSecureCookies: process.env.NODE_ENV === "production",
  defaultCookieAttributes: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  database: pool,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  socialProviders,
});

export const nodeHandler = toNodeHandler(auth);

