import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

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

  return children
}
