import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-indigo-200">
      <div>
        <h4 className="font-bold text-slate-800 text-lg">{course.name}</h4>
        <p className="text-xs text-slate-500 mt-1 font-medium">Manage content for this course</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/courses/${course.id}/resources`}
          className="flex-1 min-w-[7rem] text-center px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100 hover:bg-indigo-100 transition-colors"
        >
          Resources
        </Link>
        <Link
          to={`/courses/${course.id}/exams`}
          className="flex-1 min-w-[7rem] text-center px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
          Exams
        </Link>
        <Link
          to={`/courses/${course.id}`}
          className="w-full text-center px-3 py-2 rounded-lg text-slate-600 text-sm font-medium hover:text-indigo-600 transition-colors"
        >
          Overview →
        </Link>
      </div>
    </div>
  )
}
