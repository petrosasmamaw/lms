import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchSession } from '../features/auth/authSlice'

function PendingVerification() {
  const dispatch = useDispatch()
  const { loading } = useSelector((s) => s.auth)

  return (
    <div className="card p-8 max-w-lg mx-auto mt-12 text-center">
      <span className="text-4xl" aria-hidden>⏳</span>
      <h2 className="text-xl font-extrabold text-slate-800 mt-4">Account pending verification</h2>
      <p className="text-slate-600 mt-2 font-semibold">
        Your account has been created but an administrator must verify you before you can access courses and materials.
      </p>
      <p className="text-slate-500 text-sm mt-2">
        Please contact your department admin. Once verified, refresh this page to continue.
      </p>
      <button
        type="button"
        onClick={() => dispatch(fetchSession())}
        disabled={loading}
        className="btn-primary mt-6"
      >
        {loading ? 'Checking...' : 'Check verification status'}
      </button>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((s) => s.auth)

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role && user.role !== 'student') {
    return (
      <div className="card p-6 max-w-md mx-auto mt-12 text-center">
        <p className="text-red-600 font-semibold">This portal is for students only.</p>
        <p className="text-sm text-slate-500 mt-2">Please use the admin app if you have an admin account.</p>
      </div>
    )
  }

  if (user.role === 'student' && !user.verified) {
    return <PendingVerification />
  }

  return children
}
