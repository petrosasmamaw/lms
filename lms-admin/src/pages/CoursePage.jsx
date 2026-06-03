import { Link, useParams } from 'react-router-dom'

export default function CoursePage() {
  const { courseId } = useParams()

  return (
    <div className="page-shell">
      <Link to="/dashboard" className="link-back">← Dashboard</Link>
      <div className="mt-3 mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Course</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-0.5">Course #{courseId}</h1>
        <p className="text-slate-500 text-sm mt-1">Manage learning materials and assessments</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <Link
          to={`/courses/${courseId}/resources`}
          className="card p-8 text-center hover:border-indigo-300 hover:-translate-y-0.5 group"
        >
          <span className="text-4xl" aria-hidden>📚</span>
          <p className="text-lg font-bold text-slate-800 mt-3 group-hover:text-indigo-700 transition-colors">Resources</p>
          <p className="text-sm text-slate-500 mt-1">Upload PDFs, docs & videos</p>
        </Link>
        <Link
          to={`/courses/${courseId}/exams`}
          className="card p-8 text-center hover:border-indigo-300 hover:-translate-y-0.5 group"
        >
          <span className="text-4xl" aria-hidden>📝</span>
          <p className="text-lg font-bold text-slate-800 mt-3 group-hover:text-indigo-700 transition-colors">Exams</p>
          <p className="text-sm text-slate-500 mt-1">Create questions & exams</p>
        </Link>
      </div>
    </div>
  )
}
