import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, createCourse } from '../features/courses/coursesSlice'
import { fetchDepartments } from '../features/departments/departmentsSlice'
import axios from '../api/axiosInstance'
import { unwrap } from '../api/unwrap'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/ui/EmptyState'
import { Users, BookOpen } from 'lucide-react'

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
      <div className="mt-4 mb-8">
        <p className="eyebrow">Department</p>
        <h1 className="page-title mt-1">{deptName}</h1>
        <p className="page-subtitle font-mono">Year {year}</p>
      </div>

      <div className="flex gap-2 mb-8">
        <button type="button" onClick={() => setTab('students')} className={`tab-btn ${tab === 'students' ? 'tab-btn-active' : 'tab-btn-inactive'}`}>
          Students
        </button>
        <button type="button" onClick={() => setTab('courses')} className={`tab-btn ${tab === 'courses' ? 'tab-btn-active' : 'tab-btn-inactive'}`}>
          Courses
        </button>
      </div>

      {tab === 'students' && (
        <div className="card p-0 overflow-hidden">
          {loadingStudents && (
            <div className="loading-row px-6">
              <span className="spinner" />
              Loading students…
            </div>
          )}
          {!loadingStudents && !students.length && (
            <EmptyState
              icon={Users}
              title="No students yet"
              description="Students who register for this department and year will appear here."
            />
          )}
          {!loadingStudents && students.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium">{s.name}</td>
                    <td className="text-[var(--color-text-secondary)] font-mono text-[13px]">{s.email}</td>
                    <td>
                      <span className={`badge ${s.verified ? 'badge-success' : 'badge-warning'}`}>
                        {s.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleVerified(s)}
                        disabled={togglingId === s.id}
                        className={s.verified ? 'btn-ghost text-sm py-1.5 px-3' : 'btn-primary text-sm py-1.5 px-3'}
                      >
                        {togglingId === s.id ? '…' : s.verified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'courses' && (
        <div>
          <form onSubmit={handleCreateCourse} className="card flex flex-wrap gap-3 mb-8 p-4">
            <input className="input max-w-sm flex-1 min-w-[10rem]" value={name} onChange={(e) => setName(e.target.value)} placeholder="Course name" required />
            <button type="submit" className="btn-primary" disabled={creatingCourse || !name}>
              {creatingCourse ? 'Adding…' : 'Add course'}
            </button>
          </form>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2].map((i) => <div key={i} className="skeleton skeleton-card" />)}
            </div>
          )}
          {!loading && !courses.length && (
            <EmptyState icon={BookOpen} title="No courses yet" description="Add a course to start uploading resources and exams." />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      )}
    </div>
  )
}
