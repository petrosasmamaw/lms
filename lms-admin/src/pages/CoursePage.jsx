import { Link, useParams } from 'react-router-dom'
import { FileText, ClipboardList } from 'lucide-react'

export default function CoursePage() {
  const { courseId } = useParams()

  return (
    <div className="page-shell">
      <Link to="/dashboard" className="link-back">← Dashboard</Link>
      <div className="mt-4 mb-10">
        <p className="eyebrow">Course</p>
        <h1 className="page-title mt-1 font-mono">#{courseId}</h1>
        <p className="page-subtitle">Manage learning materials and assessments</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <Link to={`/courses/${courseId}/resources`} className="card card-interactive text-center group">
          <div className="empty-state-icon mx-auto">
            <FileText size={24} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="section-title mt-4 group-hover:text-[var(--color-accent)] transition-colors">Resources</p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">Upload PDFs, docs & videos</p>
        </Link>
        <Link to={`/courses/${courseId}/exams`} className="card card-interactive text-center group">
          <div className="empty-state-icon mx-auto">
            <ClipboardList size={24} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="section-title mt-4 group-hover:text-[var(--color-accent)] transition-colors">Exams</p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">Create questions & exams</p>
        </Link>
      </div>
    </div>
  )
}
