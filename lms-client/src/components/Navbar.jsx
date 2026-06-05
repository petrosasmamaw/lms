import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import Logo from './Logo'

export default function Navbar() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    nav('/login')
  }

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-orange-100 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo variant="student" size="md" />
        <div className="flex items-center gap-4 text-sm font-bold">
          {!user && (
            <>
              <Link to="/signup" className="text-slate-600 hover:text-orange-600 transition-colors">
                Sign Up
              </Link>
              <Link to="/login" className="btn-primary py-2 px-4 text-sm">
                Log In
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/home" className="text-slate-600 hover:text-orange-600 transition-colors">
                My Courses
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition-colors"
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
