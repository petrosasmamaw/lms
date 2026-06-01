import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupAdmin } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.auth)
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(signupAdmin({ name, email, password, role: 'admin' }))
    if (res.type.endsWith('fulfilled')) nav('/login')
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl mb-4">Create Admin Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded">
        <input className="w-full p-2 rounded bg-gray-900" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input className="w-full p-2 rounded bg-gray-900" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full p-2 rounded bg-gray-900" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <div>
          <button className="px-4 py-2 bg-indigo-600 rounded" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </div>
        {error && <p className="text-red-400">{JSON.stringify(error)}</p>}
      </form>
    </div>
  )
}
