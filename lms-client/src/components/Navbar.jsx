import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, LogOut, Wallet } from 'lucide-react'
import { logout } from '../features/auth/authSlice'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    nav('/login')
  }

  return (
    <nav className="navbar">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <Logo variant="student" size="md" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user && (
            <>
              <Link to="/signup" className="nav-link hidden sm:inline-flex">Sign up</Link>
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Log in</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/home" className="nav-link hidden sm:inline-flex items-center gap-2">
                <BookOpen size={16} strokeWidth={1.5} aria-hidden="true" />
                My courses
              </Link>
              <Link to="/payments" className="nav-link inline-flex items-center gap-2">
                <Wallet size={16} strokeWidth={1.5} aria-hidden="true" />
                <span className="hidden sm:inline">Payments</span>
              </Link>
              <button type="button" onClick={handleLogout} className="btn-ghost text-sm items-center gap-2">
                <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
