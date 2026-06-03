export function unwrap(response) {
  const body = response?.data;
  if (!body) return body;
  if (body.data !== undefined) return body.data;
  return body;
}
