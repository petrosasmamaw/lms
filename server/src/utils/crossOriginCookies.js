/** Whether cookies must be sent cross-site (Vercel frontend → Render backend). */
export function isCrossOriginProduction() {
  return Boolean(process.env.BETTER_AUTH_URL?.startsWith('https'));
}

/** Patch Set-Cookie for cross-site browser requests (SameSite=None; Secure). */
export function patchCrossOriginCookie(cookie) {
  if (typeof cookie !== 'string') return cookie;
  if (/SameSite=(None|none)/i.test(cookie)) return cookie;
  return cookie.replace(/;?\s*SameSite=[^;]*/gi, '') + '; SameSite=None; Secure';
}

/** Express middleware: ensure auth cookies work when frontend and API are on different domains. */
export function crossOriginCookieMiddleware(req, res, next) {
  if (!isCrossOriginProduction()) return next();

  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = function setHeader(name, value) {
    if (String(name).toLowerCase() === 'set-cookie') {
      value = Array.isArray(value) ? value.map(patchCrossOriginCookie) : patchCrossOriginCookie(value);
    }
    return originalSetHeader(name, value);
  };

  if (typeof res.append === 'function') {
    const originalAppend = res.append.bind(res);
    res.append = function append(name, value) {
      if (String(name).toLowerCase() === 'set-cookie') {
        return originalAppend(name, patchCrossOriginCookie(value));
      }
      return originalAppend(name, value);
    };
  }

  next();
}
