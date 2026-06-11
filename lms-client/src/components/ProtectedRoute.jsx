import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Clock, RefreshCw } from 'lucide-react'
import { fetchSession } from '../features/auth/authSlice'

function PendingVerification() {
  const dispatch = useDispatch()
  const { loading } = useSelector((s) => s.auth)

  return (
    <div className="card max-w-lg mx-auto mt-12">
      <div className="empty-state py-8">
        <div className="empty-state-icon">
          <Clock size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 className="empty-state-title">Account pending verification</h2>
        <p className="empty-state-desc">
          Your account has been created but an administrator must verify you before you can access courses and materials.
        </p>
        <button
          type="button"
          onClick={() => dispatch(fetchSession())}
          disabled={loading}
          className="btn-primary mt-6 gap-2"
        >
          <RefreshCw size={16} strokeWidth={1.5} aria-hidden="true" />
          {loading ? 'Checking…' : 'Check verification status'}
        </button>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((s) => s.auth)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <span className="spinner spinner-lg" />
        <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Loading session…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role && user.role !== 'student') {
    return (
      <div className="card max-w-md mx-auto mt-12 text-center">
        <p className="text-[var(--color-error)] font-medium">This portal is for students only.</p>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-2">
          Please use the admin app if you have an admin account.
        </p>
      </div>
    )
  }

  if (user.role === 'student' && !user.verified) {
    return <PendingVerification />
  }

  return children
}
