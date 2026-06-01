import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice';

export function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          📚 LMS
        </Link>

        <div className="flex gap-6 items-center">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm">
                {user.name} ({user.role})
              </span>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              )}
              {user.role === 'student' && (
                <Link to="/student/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
