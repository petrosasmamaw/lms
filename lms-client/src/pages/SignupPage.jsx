import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'
import { signupStudent } from '../features/auth/authSlice'
import Logo from '../components/Logo'

const YEAR_OPTIONS = [
  { label: '1st Year', value: 1 },
  { label: '2nd Year', value: 2 },
  { label: '3rd Year', value: 3 },
  { label: '4th Year', value: 4 },
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [year, setYear] = useState('1')
  const [departments, setDepartments] = useState([])
  const [loadingDepts, setLoadingDepts] = useState(true)

  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.auth)
  const nav = useNavigate()

  useEffect(() => {
    axios.get('/departments')
      .then((res) => {
        const data = unwrap(res)
        const list = Array.isArray(data) ? data : data.departments || []
        setDepartments(list)
        if (list[0]) setDepartmentId(String(list[0].id))
      })
      .catch(() => setDepartments([]))
      .finally(() => setLoadingDepts(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(signupStudent({
      name,
      email,
      password,
      departmentId: Number(departmentId),
      year: Number(year),
    }))
    if (res.type.endsWith('fulfilled')) nav('/login')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card card max-w-lg">
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <Logo variant="student" size="lg" asLink={false} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Student Sign Up</h2>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Join your department and year to access courses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Full name</label>
            <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Email</label>
            <input className="input" type="email" placeholder="student@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Password</label>
            <input className="input" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Department</label>
            <select
              className="input"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
              disabled={loadingDepts || !departments.length}
            >
              {loadingDepts && <option>Loading departments...</option>}
              {!loadingDepts && !departments.length && <option value="">No departments available</option>}
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5">Year</label>
            <select className="input" value={year} onChange={(e) => setYear(e.target.value)} required>
              {YEAR_OPTIONS.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading || !departmentId}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          {error && <p className="toast-error">{error.message || 'Sign up failed'}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 font-semibold">
          Already registered?{' '}
          <Link to="/login" className="text-orange-600 font-extrabold hover:text-orange-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
