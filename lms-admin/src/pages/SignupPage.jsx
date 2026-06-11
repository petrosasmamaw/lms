import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupAdmin } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector((s) => s.auth)
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(signupAdmin({ name, email, password }))
    if (res.type.endsWith('fulfilled')) nav('/login')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <Logo variant="admin" size="lg" asLink={false} />
          </div>
          <h2 className="font-display text-[var(--text-2xl)] font-bold text-[var(--color-text-primary)]">Create admin account</h2>
          <p className="page-subtitle">Admins are not assigned to a department or year</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" placeholder="Jane Admin" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" placeholder="you@university.edu" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" placeholder="Min. 8 characters" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
          {error && <p className="toast-error">{error.message || 'Sign up failed'}</p>}
          {message && <p className="toast-success">{message}</p>}
        </form>
        <p className="mt-6 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="link-accent">Log in</Link>
        </p>
      </div>
    </div>
  )
}
