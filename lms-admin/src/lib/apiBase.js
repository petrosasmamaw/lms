/** Resolve API base URL. Use `/api` on Vercel (proxied to Render) or full URL locally. */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return configured.replace(/\/+$/, '');
  return 'http://localhost:5001/api';
}

/** Better Auth base URL (origin only, no /api suffix). */
export function getAuthBaseUrl() {
  const apiUrl = getApiBaseUrl();
  if (apiUrl.startsWith('/')) return '';
  return apiUrl.replace(/\/api$/, '');
}
