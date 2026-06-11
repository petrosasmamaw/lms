import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

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
  if (user.role && user.role !== 'admin') return <Navigate to="/login" replace />

  return children
}
