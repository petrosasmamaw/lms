import { Link } from 'react-router-dom'
import { ArrowRight, Building2 } from 'lucide-react'

const YEAR_LABELS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

export default function DepartmentCard({ dept }) {
  const yearLabel = YEAR_LABELS[dept.year] || `${dept.year}th`

  return (
    <Link
      to={`/departments/${dept.departmentId}/year/${dept.year}`}
      className="card card-interactive group block"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-accent-muted)] flex items-center justify-center text-[var(--color-accent)]">
            <Building2 size={18} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="section-title truncate group-hover:text-[var(--color-accent)] transition-colors">
              {dept.departmentName || dept.name}
            </h3>
            <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-1 flex items-center gap-1">
              View courses & students
              <ArrowRight size={14} strokeWidth={1.5} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
            </p>
          </div>
        </div>
        <span className="badge badge-accent shrink-0 font-mono">{yearLabel}</span>
      </div>
    </Link>
  )
}
