import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../features/auth/authSlice'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((s) => s.auth)
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/home')
  }, [user, nav])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(login({ email, password }))
    if (res.type.endsWith('fulfilled')) nav('/home')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div className="text-center mb-8">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xl font-extrabold shadow-lg shadow-orange-400/40 mb-4">
            L
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Log in to access your courses and exams</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Email</label>
            <input className="input" type="email" placeholder="student@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {error && <p className="toast-error">{error.message || 'Login failed'}</p>}
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 font-semibold">
          New student?{' '}
          <Link to="/signup" className="text-orange-600 font-extrabold hover:text-orange-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
