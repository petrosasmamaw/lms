import { getApiBaseUrl } from './apiBase'

function buildHeaders(requestHeaders) {
  const headers = new Headers(requestHeaders)
  headers.delete('host')
  return headers
}

export async function getServerSession(requestHeaders) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/get-session`, {
      headers: buildHeaders(requestHeaders),
      cache: 'no-store',
      credentials: 'include',
    })

    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}
