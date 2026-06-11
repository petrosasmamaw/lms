import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDepartments, createDepartment } from '../features/departments/departmentsSlice'
import { fetchCourses } from '../features/courses/coursesSlice'
import DepartmentCard from '../components/DepartmentCard'
import EmptyState from '../components/ui/EmptyState'
import { Building2 } from 'lucide-react'

const YEAR_LABELS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { list: departments, loading } = useSelector((s) => s.departments)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [courseRows, setCourseRows] = useState([])

  useEffect(() => {
    dispatch(fetchDepartments())
    dispatch(fetchCourses({})).then((res) => {
      if (res.payload) setCourseRows(res.payload)
    })
  }, [dispatch])

  const cards = []
  const seen = new Set()
  for (const c of courseRows) {
    const key = `${c.departmentId}-${c.year}`
    if (seen.has(key)) continue
    seen.add(key)
    const dept = departments.find((d) => d.id === c.departmentId)
    if (dept) cards.push({ departmentId: dept.id, departmentName: dept.name, year: c.year })
  }
  for (const d of departments) {
    for (let y = 1; y <= 4; y += 1) {
      const key = `${d.id}-${y}`
      if (!seen.has(key)) cards.push({ departmentId: d.id, departmentName: d.name, year: y })
    }
  }

  const grouped = [1, 2, 3, 4].map((year) => ({
    year,
    items: cards.filter((c) => Number(c.year) === year),
  }))

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await dispatch(createDepartment({ name }))
      setName('')
      dispatch(fetchDepartments())
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="page-title mt-1">Dashboard</h1>
          <p className="page-subtitle">Browse departments by academic year</p>
        </div>
        <form onSubmit={handleCreate} className="card flex flex-wrap gap-3 items-center p-4">
          <input className="input max-w-xs min-w-[12rem]" placeholder="New department name" value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="btn-primary whitespace-nowrap" disabled={creating || !name}>
            {creating ? 'Adding…' : 'Add department'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      )}

      {!loading && grouped.every((g) => !g.items.length) && (
        <EmptyState
          icon={Building2}
          title="No departments yet"
          description="Create your first department to start organizing courses and students."
        />
      )}

      {grouped.map((g) => (
        <section key={g.year} className="mb-12">
          <h2 className="section-heading">
            <span className="badge badge-accent font-mono">{g.year}</span>
            {YEAR_LABELS[g.year]} year
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.items.map((item) => (
              <DepartmentCard key={`${item.departmentId}-${item.year}`} dept={item} />
            ))}
            {!g.items.length && (
              <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] col-span-full py-4">
                No departments for this year yet.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
