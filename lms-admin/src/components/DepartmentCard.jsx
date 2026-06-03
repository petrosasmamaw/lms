import { Link } from 'react-router-dom'

const YEAR_LABELS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

export default function DepartmentCard({ dept }) {
  const yearLabel = YEAR_LABELS[dept.year] || `${dept.year}th`
  return (
    <Link
      to={`/departments/${dept.departmentId}/year/${dept.year}`}
      className="card group block p-5 hover:border-indigo-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
          {dept.departmentName || dept.name}
        </h3>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {yearLabel}
        </span>
      </div>
      <p className="text-sm text-slate-500 mt-2 font-medium">View courses & students →</p>
    </Link>
  )
}
