import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
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
      <div className="flex items-center gap-3 text-slate-500 py-12">
        <span className="h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-bold">Loading course...</span>
      </div>
    )
  }

  return (
    <div>
      <Link to="/home" className="link-back">← Back to courses</Link>
      <header className="page-hero mt-3">
        <h1>{course?.name || `Course ${courseId}`}</h1>
        <p>Choose what you want to study</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <Link
          to={`/courses/${courseId}/resources`}
          className="card p-10 text-center hover:-translate-y-1 group"
        >
          <span className="text-4xl" aria-hidden>📚</span>
          <p className="font-extrabold mt-3 text-slate-800 text-lg group-hover:text-orange-600 transition-colors">Resources</p>
          <p className="text-sm text-slate-500 mt-1 font-semibold">PDFs, docs & videos</p>
        </Link>
        <Link
          to={`/courses/${courseId}/exams`}
          className="card p-10 text-center hover:-translate-y-1 group"
        >
          <span className="text-4xl" aria-hidden>📝</span>
          <p className="font-extrabold mt-3 text-slate-800 text-lg group-hover:text-orange-600 transition-colors">Exams</p>
          <p className="text-sm text-slate-500 mt-1 font-semibold">Take quizzes & tests</p>
        </Link>
      </div>
    </div>
  )
}
