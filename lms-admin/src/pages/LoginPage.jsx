import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((s) => s.auth)
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/dashboard')
  }, [user, nav])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(login({ email, password }))
    if (res.type.endsWith('fulfilled')) nav('/dashboard')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <Logo variant="admin" size="lg" asLink={false} />
          </div>
          <h2 className="font-display text-[var(--text-2xl)] font-bold text-[var(--color-text-primary)]">Admin login</h2>
          <p className="page-subtitle">Sign in to manage departments and courses</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" placeholder="you@university.edu" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" placeholder="••••••••" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
          {error && <p className="toast-error">{error.message || 'Login failed'}</p>}
        </form>
        <p className="mt-6 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          Need an account?{' '}
          <Link to="/signup" className="link-accent">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
