import { Link } from 'react-router-dom'
import { FileText, ClipboardList, ArrowRight } from 'lucide-react'

export default function CourseCard({ course }) {
  return (
    <div className="card flex flex-col gap-5">
      <div>
        <h4 className="section-title">{course.name}</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1">
          Manage content for this course
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/courses/${course.id}/resources`}
          className="btn-secondary flex-1 min-w-[7rem] text-sm justify-center gap-2"
        >
          <FileText size={14} strokeWidth={1.5} aria-hidden="true" />
          Resources
        </Link>
        <Link
          to={`/courses/${course.id}/exams`}
          className="btn-secondary flex-1 min-w-[7rem] text-sm justify-center gap-2"
        >
          <ClipboardList size={14} strokeWidth={1.5} aria-hidden="true" />
          Exams
        </Link>
        <Link
          to={`/courses/${course.id}`}
          className="btn-ghost w-full text-sm justify-center gap-1"
        >
          Overview
          <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
