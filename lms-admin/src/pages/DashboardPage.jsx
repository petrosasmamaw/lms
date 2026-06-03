import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDepartments, createDepartment } from '../features/departments/departmentsSlice'
import { fetchCourses } from '../features/courses/coursesSlice'
import DepartmentCard from '../components/DepartmentCard'

const YEAR_LABELS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { list: departments, loading } = useSelector((s) => s.departments)
  const [name, setName] = useState('')
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
    await dispatch(createDepartment({ name }))
    setName('')
    dispatch(fetchDepartments())
  }

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">Administration</p>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Browse departments by academic year</p>
        </div>
        <form onSubmit={handleCreate} className="card p-4 flex flex-wrap gap-2 items-center">
          <input className="input max-w-xs min-w-[12rem]" placeholder="New department name" value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="btn-primary whitespace-nowrap">Add Department</button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 py-8">
          <span className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading departments...</span>
        </div>
      )}

      {grouped.map((g) => (
        <section key={g.year} className="mb-12">
          <h2 className="section-heading flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
              {g.year}
            </span>
            {YEAR_LABELS[g.year]} Year
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.items.map((item) => (
              <DepartmentCard key={`${item.departmentId}-${item.year}`} dept={item} />
            ))}
            {!g.items.length && (
              <p className="text-slate-400 text-sm col-span-full py-4">No departments for this year yet.</p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
