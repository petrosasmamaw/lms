import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        const json = await res.json().catch(() => null)
        if (!mounted) return
        if (res.ok && json?.data?.user) setUser(json.data.user)
      } catch (err) {
        // ignore
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' }).catch(() => {})
    navigate('/login')
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h1 style={{ fontSize: 28 }}>Dashboard</h1>
            {user && (
              <button onClick={handleSignOut} className="btn btn-secondary">Sign Out</button>
            )}
          </div>

          {user ? (
            <div>
              <div style={{ background: 'rgba(37,99,235,0.05)', borderRadius: 8, padding: 16, border: '1px solid var(--border)', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, marginBottom: 8 }}>Welcome back!</h2>
                <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>

              <div className="grid-3">
                <div className="stat-card bg-blue">
                  <h3 style={{ margin: 0 }}>Courses</h3>
                  <p style={{ fontSize: 28, margin: 8 }}>0</p>
                </div>
                <div className="stat-card bg-green">
                  <h3 style={{ margin: 0 }}>Progress</h3>
                  <p style={{ fontSize: 28, margin: 8 }}>0%</p>
                </div>
                <div className="stat-card bg-purple">
                  <h3 style={{ margin: 0 }}>Resources</h3>
                  <p style={{ fontSize: 28, margin: 8 }}>0</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text)' }}>Not signed in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
