import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DepartmentYearPage from './pages/DepartmentYearPage'
import CoursePage from './pages/CoursePage'
import ResourcesPage from './pages/ResourcesPage'
import ExamPage from './pages/ExamPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
          <Route path="/departments/:departmentId/year/:year" element={<ProtectedRoute><DepartmentYearPage/></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CoursePage/></ProtectedRoute>} />
          <Route path="/courses/:courseId/resources" element={<ProtectedRoute><ResourcesPage/></ProtectedRoute>} />
          <Route path="/courses/:courseId/exams" element={<ProtectedRoute><ExamPage/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
