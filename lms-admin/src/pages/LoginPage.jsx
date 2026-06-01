import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((s) => s.auth)
  const nav = useNavigate()

  useEffect(() => {
    if (user) nav('/dashboard')
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(login({ email, password }))
    if (res.type.endsWith('fulfilled')) nav('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded">
        <input className="w-full p-2 rounded bg-gray-900" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full p-2 rounded bg-gray-900" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <div>
          <button className="px-4 py-2 bg-indigo-600 rounded" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
        </div>
        {error && <p className="text-red-400">{JSON.stringify(error)}</p>}
      </form>
    </div>
  )
}
