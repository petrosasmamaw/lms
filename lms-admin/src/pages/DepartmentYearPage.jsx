import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, createCourse } from '../features/courses/coursesSlice'
import { fetchDepartments } from '../features/departments/departmentsSlice'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'
import CourseCard from '../components/CourseCard'

export default function DepartmentYearPage() {
  const { departmentId, year } = useParams()
  const dispatch = useDispatch()
  const { list: courses, loading } = useSelector((s) => s.courses)
  const { list: departments } = useSelector((s) => s.departments)
  const [tab, setTab] = useState('courses')
  const [name, setName] = useState('')
  const [creatingCourse, setCreatingCourse] = useState(false)
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const dept = departments.find((d) => String(d.id) === String(departmentId))
  const deptName = dept?.name || `Department ${departmentId}`

  const loadStudents = () => {
    setLoadingStudents(true)
    axios
      .get('/users', { params: { role: 'student', departmentId, year } })
      .then((res) => setStudents(unwrap(res).users || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false))
  }

  useEffect(() => {
    dispatch(fetchDepartments())
    dispatch(fetchCourses({ departmentId, year }))
  }, [departmentId, year, dispatch])

  useEffect(() => {
    if (tab !== 'students') return
    loadStudents()
  }, [tab, departmentId, year])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setCreatingCourse(true)
    try {
      await dispatch(createCourse({ name, departmentId: Number(departmentId), year: Number(year) }))
      setName('')
      dispatch(fetchCourses({ departmentId, year }))
    } finally {
      setCreatingCourse(false)
    }
  }

  const handleToggleVerified = async (student) => {
    setTogglingId(student.id)
    try {
      const res = await axios.patch(`/users/${student.id}/verified`, {
        verified: !student.verified,
      })
      const updated = unwrap(res).user
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, verified: updated.verified } : s)),
      )
    } catch {
      alert('Failed to update verification status')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="page-shell">
      <Link to="/dashboard" className="link-back">← Dashboard</Link>
      <div className="mt-3 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Department</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-0.5">{deptName}</h1>
        <p className="text-slate-500 text-sm mt-1">Year {year}</p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          type="button"
          onClick={() => setTab('students')}
          className={`tab-btn ${tab === 'students' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
        >
          Students
        </button>
        <button
          type="button"
          onClick={() => setTab('courses')}
          className={`tab-btn ${tab === 'courses' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
        >
          Courses
        </button>
      </div>

      {tab === 'students' && (
        <div className="card p-5">
          {loadingStudents && (
            <div className="flex items-center gap-2 text-slate-500">
              <span className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Loading students...
            </div>
          )}
          {!loadingStudents && !students.length && (
            <p className="text-slate-500 py-4 text-center">No students in this department/year yet.</p>
          )}
          <ul className="divide-y divide-slate-100">
            {students.map((s) => (
              <li key={s.id} className="py-3.5 flex flex-wrap justify-between items-center gap-3">
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-800 block">{s.name}</span>
                  <span className="text-slate-500 text-sm truncate block">{s.email}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full border ${
                      s.verified
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {s.verified ? 'Verified' : 'Pending'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleVerified(s)}
                    disabled={togglingId === s.id}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      s.verified
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        : 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                    }`}
                  >
                    {togglingId === s.id
                      ? '...'
                      : s.verified
                        ? 'Unverify'
                        : 'Verify'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'courses' && (
        <div>
          <form onSubmit={handleCreateCourse} className="card p-4 flex flex-wrap gap-2 mb-8">
            <input className="input max-w-sm flex-1 min-w-[10rem]" value={name} onChange={(e) => setName(e.target.value)} placeholder="Course name" required />
            <button type="submit" className="btn-primary" disabled={creatingCourse || !name}>
              {creatingCourse ? 'Adding...' : 'Add Course'}
            </button>
          </form>
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <span className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Loading courses...
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      )}
    </div>
  )
}
