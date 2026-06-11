import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { FileText, ClipboardList } from 'lucide-react'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'

export default function CoursePage() {
  const { courseId } = useParams()
  const location = useLocation()
  const [course, setCourse] = useState(location.state?.course || null)
  const [loading, setLoading] = useState(!course)

  useEffect(() => {
    if (course) return
    axios.get(`/courses/${courseId}`)
      .then((res) => {
        const data = unwrap(res)
        setCourse(data.course)
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [courseId, course])

  if (loading) {
    return (
      <div className="loading-row">
        <span className="spinner" />
        Loading course…
      </div>
    )
  }

  return (
    <div>
      <Link to="/home" className="link-back">← Back to courses</Link>
      <header className="page-hero mt-4">
        <h1>{course?.name || `Course ${courseId}`}</h1>
        <p>Choose what you want to study</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <Link to={`/courses/${courseId}/resources`} className="card card-interactive text-center group">
          <div className="empty-state-icon mx-auto">
            <FileText size={24} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="section-title mt-4 group-hover:text-[var(--color-accent)] transition-colors">Resources</p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">PDFs, docs & videos</p>
        </Link>
        <Link to={`/courses/${courseId}/exams`} className="card card-interactive text-center group">
          <div className="empty-state-icon mx-auto">
            <ClipboardList size={24} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="section-title mt-4 group-hover:text-[var(--color-accent)] transition-colors">Exams</p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">Take quizzes & tests</p>
        </Link>
      </div>
    </div>
  )
}
