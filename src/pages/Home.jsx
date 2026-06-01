import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Home() {
  const [user, setUser] = useState(null)

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

  return (
    <div>
      <section className="page-hero">
        <div className="hero-title">Learning Management System</div>
        <div className="hero-sub">A modern platform for managing courses, resources, and student progress</div>
        <div className="cta-group">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-primary">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Create Account</Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-emoji">📚</div>
          <h3>Course Management</h3>
          <p>Organize and manage multiple courses with ease</p>
        </div>
        <div className="feature-card">
          <div className="feature-emoji">📊</div>
          <h3>Progress Tracking</h3>
          <p>Monitor student progress and achievements</p>
        </div>
        <div className="feature-card">
          <div className="feature-emoji">📁</div>
          <h3>Resource Library</h3>
          <p>Access and organize learning materials</p>
        </div>
      </section>
    </div>
  )
}
