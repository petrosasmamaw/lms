import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { fetchSession } from './features/auth/authSlice'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import ResourcesPage from './pages/ResourcesPage'
import ExamPage from './pages/ExamPage'

function HomeRedirect() {
  const user = useSelector((s) => s.auth.user)
  return <Navigate to={user ? '/home' : '/login'} replace />
}

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSession())
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-6 md:px-6 md:py-8">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/exams" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}
