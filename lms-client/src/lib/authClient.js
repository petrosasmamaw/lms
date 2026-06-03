import { createAuthClient } from 'better-auth/react'

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5001'

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
})

export const { signIn, signOut, getSession } = authClient
