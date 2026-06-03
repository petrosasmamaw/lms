import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupAdmin } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'

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
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xl font-bold shadow-lg shadow-indigo-500/30 mb-4">
            A
          </span>
          <h2 className="text-2xl font-bold text-slate-800">Create Admin Account</h2>
          <p className="text-slate-500 text-sm mt-1">Admins are not assigned to a department or year</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Full name</label>
            <input className="input" placeholder="Jane Admin" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
            <input className="input" placeholder="you@university.edu" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Password</label>
            <input className="input" placeholder="Min. 8 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
          {error && <p className="toast-error">{error.message || 'Sign up failed'}</p>}
          {message && <p className="toast-success">{message}</p>}
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
