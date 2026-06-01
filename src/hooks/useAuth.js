import { useState, useEffect, useCallback } from 'react'
import { authClient } from '../lib/authClient'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      // Use Better Auth's built-in session method
      const session = await authClient.getSession()
      setUser(session?.user || null)
    } catch (e) {
      console.error('Failed to get session:', e)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut()
    } catch (e) {
      console.error('Sign out error:', e)
    }
    setUser(null)
  }, [])

  return { user, loading, refresh, signOut, setUser }
}
