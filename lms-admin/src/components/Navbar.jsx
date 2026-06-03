import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export default function Navbar() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    nav('/login')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/30">
            A
          </span>
          <span className="font-bold text-lg text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors">
            LMS Admin
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium">
          {!user && (
            <>
              <Link to="/signup" className="text-slate-600 hover:text-indigo-600 px-2 py-1.5 transition-colors">
                Sign Up
              </Link>
              <Link to="/login" className="btn-primary py-2 px-4 text-sm">
                Log In
              </Link>
            </>
          )}
          {user && (
            <>
              <span className="hidden sm:inline text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium truncate max-w-[200px]">
                {user.email}
              </span>
              <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 px-2 py-1.5 transition-colors">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-600 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
