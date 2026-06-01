import { Link } from 'react-router-dom'
import { signOut } from '../lib/authClient'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, { credentials: 'include' })
        const json = await res.json().catch(() => null)
        if (!mounted) return
        if (res.ok && json?.data?.user) setUser(json.data.user)
        else setUser(null)
      } catch (err) {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleSignOut() {
    try {
      await signOut()
    } catch (e) {
      // ignore
    }
    setUser(null)
    window.location.href = '/login'
  }
  return (
    <header className="site-header">
      <div className="site-container">
        <Link to="/" className="brand">
          <div className="brand-logo">L</div>
          <div className="brand-text">LMS</div>
        </Link>

        <nav className="site-nav">
          <Link to="/" className="nav-link">Home</Link>
          {!user && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
          {user && (
            <>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="nav-link">Dashboard</Link>
              <button onClick={handleSignOut} className="signout-btn">Sign out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
