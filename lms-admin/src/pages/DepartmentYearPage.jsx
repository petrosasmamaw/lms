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
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)

  const dept = departments.find((d) => String(d.id) === String(departmentId))
  const deptName = dept?.name || `Department ${departmentId}`

  useEffect(() => {
    dispatch(fetchDepartments())
    dispatch(fetchCourses({ departmentId, year }))
  }, [departmentId, year, dispatch])

  useEffect(() => {
    if (tab !== 'students') return
    setLoadingStudents(true)
    axios
      .get('/users', { params: { role: 'student', departmentId, year } })
      .then((res) => setStudents(unwrap(res).users || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false))
  }, [tab, departmentId, year])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    await dispatch(createCourse({ name, departmentId: Number(departmentId), year: Number(year) }))
    setName('')
    dispatch(fetchCourses({ departmentId, year }))
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
              <li key={s.id} className="py-3.5 flex justify-between items-center gap-4">
                <span className="font-semibold text-slate-800">{s.name}</span>
                <span className="text-slate-500 text-sm truncate">{s.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'courses' && (
        <div>
          <form onSubmit={handleCreateCourse} className="card p-4 flex flex-wrap gap-2 mb-8">
            <input className="input max-w-sm flex-1 min-w-[10rem]" value={name} onChange={(e) => setName(e.target.value)} placeholder="Course name" required />
            <button type="submit" className="btn-primary">Add Course</button>
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
