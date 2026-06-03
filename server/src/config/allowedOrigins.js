/** Local dev ports: admin (5173), alt (5174), student client (5175) */
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
];

/**
 * Origins allowed for CORS and Better Auth trustedOrigins.
 * Set STUDENT_CLIENT_URL / ADMIN_CLIENT_URL / CLIENT_URL in .env for production.
 */
export function getAllowedOrigins() {
  const fromEnv = [
    process.env.CLIENT_URL,
    process.env.STUDENT_CLIENT_URL,
    process.env.ADMIN_CLIENT_URL,
  ].filter(Boolean);

  return [...new Set([...fromEnv, ...DEFAULT_ORIGINS])];
}
