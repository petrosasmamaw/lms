import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutLocal } from '../features/auth/authSlice'

export default function Navbar() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const handleLogout = () => {
    dispatch(logoutLocal())
    nav('/login')
  }

  return (
    <nav className="bg-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">LMS Admin</Link>
        <div className="space-x-4">
          {!user && (
            <>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
              <Link to="/login" className="hover:underline">Log In</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button onClick={handleLogout} className="ml-2 bg-red-600 px-3 py-1 rounded">Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
