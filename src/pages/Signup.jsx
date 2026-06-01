import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authClient } from '../lib/authClient'
import FormInput from '../components/FormInput'
import Button from '../components/Button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [departmentId, setDepartmentId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/departments/public`)
        const json = await res.json().catch(() => null)
        if (!mounted) return
        // normalize response to an array
        let list = []
        if (!json) list = []
        else if (Array.isArray(json)) list = json
        else if (Array.isArray(json?.data)) list = json.data
        else if (Array.isArray(json?.data?.departments)) list = json.data.departments
        else if (Array.isArray(json?.departments)) list = json.departments
        else list = []
        setDepartments(list)
      } catch (err) {
        if (mounted) setDepartments([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('Debug: Form submitted - name:', name, 'email:', email, 'role:', role)
    setLoading(true)
    setError(null)
    try {
      // Sign up with Better Auth via backend endpoint to avoid client-side redirects
      const signRes = await fetch(`${API_URL}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        redirect: 'manual',
        body: JSON.stringify({ name, email, password, callbackURL: '/' }),
      })

      if (!signRes.ok) {
        const signJson = await signRes.json().catch(() => null)
        setError(signJson?.message || 'Sign up failed')
        setLoading(false)
        return
      }

      // Wait for Better Auth session to be established (poll /api/users/me)
      let session = null
      const maxAttempts = 8
      let attempt = 0
      while (attempt < maxAttempts) {
        attempt += 1
        await new Promise((r) => setTimeout(r, 400))
        try {
          const meRes = await fetch(`${API_URL}/api/users/me`, { credentials: 'include' })
          const meJson = await meRes.json().catch(() => null)
          if (meRes.ok && meJson?.data?.user) {
            session = meJson.data.user
            break
          }
        } catch (err) {
          // ignore and retry
        }
      }

      if (!session) {
        setError('Sign up succeeded but session not available yet. Try signing in.')
        setLoading(false)
        return
      }

      // Create local app user record (server-side link to Better Auth session)
      const payload = {
        name,
        email,
        password,
        role,
        department_id: departmentId || null,
        student_id: studentId || null,
      }
      
      console.log('Debug: Signup payload:', payload)
      console.log('Debug: State values - name:', name, 'email:', email, 'role:', role)

      const createRes = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const createJson = await createRes.json().catch(() => null)
      if (!createRes.ok) {
        setError(createJson?.message || 'Failed to create app user')
        setLoading(false)
        return
      }

      // Redirect to dashboard after successful signup
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Create account</h1>
        <p style={{ color: 'var(--text)', marginBottom: 16 }}>Join our modern learning management system</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '12px' }}>
            <label className="form-label">Full name</label>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="form-input"
            />
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '12px' }}>
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="form-input"
            />
          </div>

          <div style={{ marginBottom: 12, textAlign: 'left' }}>
            <label className="form-label">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <FormInput name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="new-password" />

          {role === 'student' && (
            <>
              <div style={{ marginBottom: 12, textAlign: 'left' }}>
                <label className="form-label">Department</label>
                <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required className="form-input">
                  <option value="">Select department</option>
                  {Array.isArray(departments) && departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <FormInput label="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
            </>
          )}

          <Button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</Button>
        </form>
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text)', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
