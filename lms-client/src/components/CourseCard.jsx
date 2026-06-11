import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CourseCard({ course }) {
  return (
    <div className="card card-interactive flex flex-col justify-between min-h-[168px]">
      <div>
        <h3 className="section-title leading-snug">{course.name}</h3>
        <span className="badge badge-accent mt-3 font-mono">
          Year {course.year}
        </span>
      </div>
      <Link
        to={`/courses/${course.id}`}
        state={{ course }}
        className="btn-primary text-sm py-2.5 w-full mt-5 gap-2"
      >
        Open course
        <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </div>
  )
}
