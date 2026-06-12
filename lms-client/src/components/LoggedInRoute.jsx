import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

/** Requires login only — does not require admin verification (e.g. payments). */
export default function LoggedInRoute({ children }) {
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
      </div>
    )
  }

  return children
}
