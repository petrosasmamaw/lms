import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authClient } from '../lib/authClient'
import FormInput from '../components/FormInput'
import Button from '../components/Button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      })

      if (signInError) {
        setError(signInError.message || "Incorrect email or password")
        setLoading(false)
        return
      }

      // Redirect to dashboard after successful login
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || "Network error")
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Sign in</h1>
        <p style={{ color: 'var(--text)', marginBottom: 16 }}>Access your learning management account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <FormInput name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />

          <Button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text)', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

